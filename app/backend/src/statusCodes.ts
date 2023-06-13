const statusCodes: Record<string, number> = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  unprocessableEntity: 422,
  internalServerError: 500,
};

export default statusCodes;
