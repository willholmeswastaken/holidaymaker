import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

export const requireAuth =
  (func: GetServerSideProps | undefined, callbackPath: string) =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: `/api/auth/signin?callbackUrl=/${callbackPath}`,
          permanent: false,
        },
      };
    }
    if (func) return await func(ctx);
    return {
      props: {},
    };
  };
