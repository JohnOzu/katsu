import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDeadlineEmail } from '@/src/lib/mailer';

export async function GET(req: NextRequest) {
	// Auth check — Vercel sends the CRON_SECRET as a bearer token
	const authHeader = req.headers.get('x-cron-secret');
    if (authHeader !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!, // needs service role to bypass RLS
	);

	const now = new Date();
	const maxDays = 7; // furthest threshold we support

	const maxDate = new Date(now);
	maxDate.setDate(maxDate.getDate() + maxDays);

	// Fetch all tasks with deadlines in the next 7 days
	const { data: tasks, error: tasksError } = await supabase
		.from('tasks')
		.select('id, name, deadline, class_id, classes(name)')
		.gte('deadline', now.toISOString())
		.lte('deadline', maxDate.toISOString());

	if (tasksError) {
		console.error('[cron] Failed to fetch tasks:', tasksError);
		return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
	}

	if (!tasks || tasks.length === 0) {
		return NextResponse.json({ message: 'No upcoming tasks' });
	}

	// Get all class IDs that have upcoming tasks
	const classIds = [...new Set(tasks.map((t) => t.class_id))];

	// Fetch all class members in those classes who have notifications enabled
	const { data: members, error: membersError } = await supabase
        .from('class_members')
        .select('user_id, class_id, notifications_enabled, notification_thresholds')
        .in('class_id', classIds)
        .eq('notifications_enabled', true);

    if (membersError) {
        console.error('[cron] Failed to fetch members:', membersError);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }

    if (!members || members.length === 0) {
        return NextResponse.json({ message: 'No members with notifications enabled' });
    }

    // Fetch profiles for those members
    const userIds = [...new Set(members.map(m => m.user_id))];
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

    if (profilesError) {
        console.error('[cron] Failed to fetch profiles:', profilesError);
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));

	// Build a map: userId -> { email, name, tasks[] }
	const emailMap: Record<
		string,
		{
			email: string;
			name: string;
			tasks: { taskName: string; className: string; deadline: string; daysLeft: number }[];
		}
	> = {};

	for (const member of members) {
		const profile = profileMap[member.user_id];
        if (!profile?.email) continue;

		const thresholds: number[] = member.notification_thresholds ?? [1, 3, 7];

		// Find tasks in this member's class that fall within one of their thresholds
		const matchingTasks = tasks.filter((task) => {
			if (task.class_id !== member.class_id) return false;

			const deadline = new Date(task.deadline);
			const daysLeft = Math.ceil(
				(deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
			);

			return thresholds.includes(daysLeft);
		});

		if (matchingTasks.length === 0) continue;

		if (!emailMap[member.user_id]) {
			emailMap[member.user_id] = {
				email: profile.email,
				name: profile.full_name ?? 'there',
				tasks: [],
			};
		}

		for (const task of matchingTasks) {
            const deadline = new Date(task.deadline);
            const classesData = task.classes as { name: string }[] | { name: string } | null;
            const className = Array.isArray(classesData)
                ? classesData[0]?.name ?? 'Unknown Class'
                : classesData?.name ?? 'Unknown Class';
            const daysLeft = Math.ceil(
                (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            );

            emailMap[member.user_id].tasks.push({
                taskName: task.name,
                className,
				deadline: deadline.toLocaleDateString('en-US', {
					weekday: 'short',
					month: 'short',
					day: 'numeric',
					hour: 'numeric',
					minute: '2-digit',
				}),
				daysLeft,
			});
		}
	}

	// Send one email per user (batching all their tasks across all classes)
	const results = await Promise.allSettled(
		Object.entries(emailMap).map(([, { email, name, tasks: userTasks }]) =>
			sendDeadlineEmail({ to: email, userName: name, tasks: userTasks }),
		),
	);

	const sent = results.filter((r) => r.status === 'fulfilled').length;
	const failed = results.filter((r) => r.status === 'rejected').length;

	console.log(`[cron] Sent ${sent} emails, ${failed} failed ${process.env.SUPABASE_SERVICE_ROLE_KEY}`);

	return NextResponse.json({ sent, failed });
}