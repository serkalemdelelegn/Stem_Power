import { NextRequest, NextResponse } from "next/server"
import {
  listSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  type ContactSubmission,
} from "@/lib/contact-submissions-store"

export async function GET(req: NextRequest) {
  try {
    const submissions = await listSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, organization, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields", details: { firstName: !firstName, lastName: !lastName, email: !email, subject: !subject, message: !message } },
        { status: 400 }
      )
    }

    const submission = await addSubmission({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      organization: organization?.trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 })
    }

    const updated = await updateSubmission(id, updates)
    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 })
    }

    const deleted = await deleteSubmission(id)
    if (!deleted) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting submission:", error)
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 })
  }
}

