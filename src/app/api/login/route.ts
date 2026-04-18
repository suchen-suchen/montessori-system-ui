import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // =========================
    // ADMIN
    // =========================
    const [adminRows]: any = await pool.execute(
      `SELECT * FROM admins WHERE email = ? LIMIT 1`,
      [email]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];

      if (admin.password === password) {
        return NextResponse.json({
          success: true,
          user: {
            id: admin.id,
            email: admin.email,
            role: 'admin',
          },
        });
      }
    }

    // =========================
    // TEACHER
    // =========================
    const [teacherRows]: any = await pool.execute(
      `SELECT * FROM teachers WHERE email = ? LIMIT 1`,
      [email]
    );

    if (teacherRows.length > 0) {
      const teacher = teacherRows[0];

      if (teacher.password === password) {
        return NextResponse.json({
          success: true,
          user: {
            id: teacher.id,
            email: teacher.email,
            role: 'teacher',
          },
        });
      }
    }

    // =========================
    // STUDENT
    // =========================
    const [studentRows]: any = await pool.execute(
      `SELECT * FROM students WHERE email = ? LIMIT 1`,
      [email]
    );

    if (studentRows.length > 0) {
      const student = studentRows[0];

      if (student.password === password) {
        return NextResponse.json({
          success: true,
          user: {
            id: student.id,
            email: student.email,
            role: 'student',
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}