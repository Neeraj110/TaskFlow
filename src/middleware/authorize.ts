export function forbidden(message = "Forbidden") {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> bf549288fa7e895f2d839dfd891a3c80434ac3db
