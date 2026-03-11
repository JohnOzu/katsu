import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

export interface DeadlineEmailPayload {
	to: string;
	userName: string;
	tasks: {
		taskName: string;
		className: string;
		deadline: string;
		daysLeft: number;
	}[];
}

export async function sendDeadlineEmail({ to, userName, tasks }: DeadlineEmailPayload) {
	const taskRows = tasks
		.map((t) => {
			const urgencyColor = t.daysLeft <= 1 ? '#ef4444' : t.daysLeft <= 3 ? '#f97316' : '#3b82f6';
			const urgencyLabel = t.daysLeft === 0 ? 'Due today' : t.daysLeft === 1 ? 'Due tomorrow' : `${t.daysLeft} days left`;
			return `
				<tr>
					<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
						<div style="font-weight: 600; color: #0f172a; font-size: 14px;">${t.taskName}</div>
						<div style="color: #64748b; font-size: 12px; margin-top: 2px;">${t.className}</div>
					</td>
					<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; white-space: nowrap;">
						<div style="color: #334155; font-size: 13px;">${t.deadline}</div>
					</td>
					<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: right;">
						<span style="display: inline-block; padding: 3px 10px; border-radius: 99px; background: ${urgencyColor}1a; color: ${urgencyColor}; font-size: 12px; font-weight: 600;">
							${urgencyLabel}
						</span>
					</td>
				</tr>
			`;
		})
		.join('');

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</head>
		<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<div style="max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

				<!-- Header -->
				<div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 32px 24px;">
					<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
						<div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
							<span style="color: white; font-size: 18px;">📚</span>
						</div>
						<span style="color: white; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">Katsu</span>
					</div>
					<h1 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">Upcoming Deadlines</h1>
					<p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 14px;">
						Hey ${userName}, you have ${tasks.length} task${tasks.length !== 1 ? 's' : ''} coming up soon.
					</p>
				</div>

				<!-- Table -->
				<div style="padding: 24px 32px;">
					<table style="width: 100%; border-collapse: collapse;">
						<thead>
							<tr style="background: #f8fafc;">
								<th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0;">Task</th>
								<th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0;">Deadline</th>
								<th style="padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0;">Status</th>
							</tr>
						</thead>
						<tbody>
							${taskRows}
						</tbody>
					</table>
				</div>

				<!-- Footer -->
				<div style="padding: 20px 32px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
					<p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
						You're receiving this because you have deadline notifications enabled in Katsu.<br/>
						You can manage your notification preferences inside any class on the Members tab.
					</p>
				</div>

			</div>
		</body>
		</html>
	`;

	await transporter.sendMail({
		from: `"Katsu" <${process.env.GMAIL_USER}>`,
		to,
		subject: `📅 You have ${tasks.length} upcoming deadline${tasks.length !== 1 ? 's' : ''} — Katsu`,
		html,
	});
}