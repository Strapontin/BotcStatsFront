import { Link } from "@nextui-org/react";
import { Fragment } from "react";
import { getAllRoles, getRoleById } from "../../../data/back-api/back-api";
import { Role } from "@/entities/Role";

export default function RoleIdPage({ roleLoaded }: { roleLoaded: Role }) {
  return (
    <Fragment>
      TODO !!! Suggestions ?<Link href="/roles">Go to roles</Link>
    </Fragment>
  );
}

export async function getStaticProps({
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
    revalidate: 5,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
