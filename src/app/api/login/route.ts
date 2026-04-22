import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
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
        dashboard_access
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = rows[0];

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (Number(user.is_active) !== 1) {
      return NextResponse.json(
        { success: false, message: 'This account is inactive.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        dashboard_access: user.dashboard_access,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}