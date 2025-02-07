import prisma from "@/lib/db";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("data", data);

  //verify webhook from stripe

  // fullfill webhook
  await prisma.user.update({
    where: {
      email: data.data.object.customer_email,
    },
    data: {
      hasAccess: true,
    },
  });

  // return 200 ok
  return Response.json(null, { status: 200 });
}
