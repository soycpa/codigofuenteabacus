import { redirect } from "next/navigation";
export default function FunnelHome({ params }: { params: { slug: string } }) {
  redirect(`/f/${params.slug}/1`);
}
