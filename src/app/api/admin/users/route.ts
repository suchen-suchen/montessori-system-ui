import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
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
      ORDER BY id DESC
      `
    );

    return NextResponse.json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to load users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      full_name,
      email,
      password,
      role,
      is_active,
      dashboard_access,
    } = await req.json();

    if (!full_name || !email || !password || !role || !dashboard_access) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role.' },
        { status: 400 }
      );
    }

    if (!validRoles.includes(dashboard_access)) {
      return NextResponse.json(
        { success: false, message: 'Invalid dashboard access.' },
        { status: 400 }
      );
    }

    const [existingRows]: any = await pool.execute(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (existingRows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email already exists.' },
        { status: 409 }
      );
    }

    const activeValue = Number(is_active) === 0 ? 0 : 1;

    const [result]: any = await pool.execute(
      `
      INSERT INTO users (
        full_name,
        email,
        password,
        role,
        is_active,
        dashboard_access
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [full_name, email, password, role, activeValue, dashboard_access]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('CREATE USER ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}