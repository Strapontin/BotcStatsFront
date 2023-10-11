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
  const roles = await getAllRoles();

  const paths = roles.map((role) => ({
    params: { roleId: role.id.toString() },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
};
