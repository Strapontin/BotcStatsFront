import { Role } from "@/entities/Role";
import { Link } from "@nextui-org/react";
import { getRoleById } from "../../../data/back-api/back-api";

export default function RoleIdPage({ roleLoaded }: { roleLoaded: Role }) {
  return (
    <>
      TODO !!! Suggestions ?<Link href="/roles">Go to roles</Link>
    </>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { roleId: number };
}) {
  const roleLoaded = await getRoleById(params.roleId);

  if (!roleLoaded || roleLoaded.status === 404) {
    return { notFound: true };
  }

  return {
    props: {
      roleLoaded,
    },
  };
}
