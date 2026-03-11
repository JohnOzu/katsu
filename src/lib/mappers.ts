export type Role = 'owner' | 'editor' | 'contributor' | 'member';

// ─── Raw DB types ──────────────────────────────────────────────────────────

export type DBClassInvite = {
  id: string;
  class_id: string;
  code: string;
  password: string;
}

export type DBClassInviteForJoin = {
  id: string;
  class_id: string;
  classes: {
    name: string
  } | null  // single object, not array
}

export type DBClassMember = {
  user_id: string;
  class_id: string;
  role: Role;
  joined_at: string;
};

export type DBClassSubject = {
    id: string;
    class_id: string;
    name: string;
    description?: string;
}

export type DBClass = {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
};

export type DBProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
};

export type DBTask = {
  id: string;
  subject_id: string | null;
  class_id: string;
  name: string;
  description?: string;
  deadline: string;
  created_by: string;
};

export type DBTaskCompletions = {
    id: string;
    task_id: string;
    user_id: string;
    is_public: boolean;
}

// ─── Mappers ───────────────────────────────────────────────────────────────

export const mapClass = (c: DBClass, role: Role, memberCount?: number) => ({
  id: c.id,
  name: c.name,
  description: c.description ?? null,
  createdBy: c.created_by,
  createdAt: c.created_at,
  myRole: role,
  memberCount,
});

export const mapClassMember = (m: DBClassMember) => ({
  userId: m.user_id,
  classId: m.class_id,
  role: m.role,
  joinedAt: m.joined_at,
});

export const mapProfile = (p: DBProfile) => ({
  id: p.id,
  fullName: p.full_name,
  avatarUrl: p.avatar_url,
  email: p.email,
});

export const mapSubject = (s: DBClassSubject) => ({
  id: s.id,
  classId: s.class_id,
  name: s.name,
  description: s.description ?? null,
});

export const mapTask = (t: DBTask) => ({
  id: t.id,
  classId: t.class_id,
  subjectId: t.subject_id,
  name: t.name,
  description: t.description ?? null,
  deadline: t.deadline ?? null,
  createdBy: t.created_by,
});

export const mapTaskCompletion = (c: DBTaskCompletions) => ({
  id: c.id,
  taskId: c.task_id,
  userId: c.user_id,
  isPublic: c.is_public,
});

export const mapClassInvite = (i: DBClassInvite) => ({
  id: i.id,
  classId: i.class_id,
  code: i.code,
  password: i.password,
});

export const mapClassInviteForJoin = (j: DBClassInviteForJoin) => ({
  id: j.id,
  classId: j.class_id,
  classes: j.classes
})

// ─── App types ─────────────────────────────────────────────────────────────

export type ClassItem = ReturnType<typeof mapClass>;
export type ClassMember = ReturnType<typeof mapClassMember>;
export type Profile = ReturnType<typeof mapProfile>;
export type Subject = ReturnType<typeof mapSubject>;
export type Task = ReturnType<typeof mapTask>;
export type TaskCompletion = ReturnType<typeof mapTaskCompletion>;
export type ClassInvite = ReturnType<typeof mapClassInvite>;
export type ClassInviteForJoin = ReturnType<typeof mapClassInviteForJoin>;