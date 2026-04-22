import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: {
    id: string;
  };
};

const VALID_ROLES = ['admin', 'teacher', 'student'] as const;

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = Number(context.params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID.' },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.execute(
      `
      SELECT 
        id,
        full_name,
        email,
        password,
        role,
        is_active,
        dashboard_access,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error('GET USER ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to load user' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const id = Number(context.params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID.' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const full_name = String(body.full_name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '').trim();
    const role = String(body.role ?? '').trim().toLowerCase();

    if (!full_name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      return NextResponse.json(
        { success: false, message: 'Invalid role.' },
        { status: 400 }
      );
    }

    const [existingRows]: any = await pool.execute(
      `SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1`,
      [email, id]
    );

    if (existingRows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email already exists.' },
        { status: 409 }
      );
    }

    const activeValue = Number(body.is_active) === 0 ? 0 : 1;
    const dashboard_access = role;

    const [result]: any = await pool.execute(
      `
      UPDATE users
      SET
        full_name = ?,
        email = ?,
        password = ?,
        role = ?,
        is_active = ?,
        dashboard_access = ?
      WHERE id = ?
      `,
      [full_name, email, password, role, activeValue, dashboard_access, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully.',
    });
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const id = Number(context.params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID.' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}