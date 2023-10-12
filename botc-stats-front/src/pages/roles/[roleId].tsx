import { Link } from "@nextui-org/react";
import { Fragment } from "react";
import { getAllRoles, getRoleById } from "../../../data/back-api/back-api";

export default function RoleIdPage() {
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
  const { roleId } = params;
  const roleLoaded = await getRoleById(roleId);

  return {
    props: {
      roleLoaded,
    },
    revalidate: 10,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: true };
};
