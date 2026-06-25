import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfileEditForm from "@/components/ProfileEditForm"

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-4 text-black">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProfileEditForm
          initialName={user.name}
          initialBio={user.bio}
        />
      </section>
    </main>
  )
}