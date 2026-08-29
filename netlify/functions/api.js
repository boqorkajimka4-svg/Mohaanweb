import articles from "../../api/articles.js";
import categories from "../../api/categories.js";
import contact from "../../api/contact.js";
import media from "../../api/media.js";
import nav from "../../api/nav.js";
import products from "../../api/products.js";
import sections from "../../api/sections.js";
import seo from "../../api/seo.js";
import settings from "../../api/settings.js";
import upload from "../../api/upload.js";

const routes = {
  articles,
  categories,
  contact,
  media,
  nav,
  products,
  sections,
  seo,
  settings,
  upload,
};

function createResponse() {
  let statusCode = 200;
  const headers = {};

  const response = {
    setHeader(name, value) {
      headers[name] = String(value);
    },

    status(code) {
      statusCode = Number(code);
      return response;
    },

    json(value) {
      headers["Content-Type"] = "application/json; charset=utf-8";

      return new Response(JSON.stringify(value), {
        status: statusCode,
        headers,
      });
    },

    end(value = "") {
      return new Response(value, {
        status: statusCode,
        headers,
      });
    },
  };

  return response;
}

function getRouteName(url) {
  const functionPath = "/.netlify/functions/api/";
  const functionIndex = url.pathname.indexOf(functionPath);

  if (functionIndex !== -1) {
    return url.pathname
      .slice(functionIndex + functionPath.length)
      .split("/")[0];
  }

  const apiPath = "/api/";
  const apiIndex = url.pathname.indexOf(apiPath);

  if (apiIndex !== -1) {
    return url.pathname
      .slice(apiIndex + apiPath.length)
      .split("/")[0];
  }

  return "";
}

export default async function handler(request) {
  const url = new URL(request.url);
  const routeName = getRouteName(url);
  const route = routes[routeName];

  if (!route) {
    return new Response(
      JSON.stringify({
        error: "API route not found",
        route: routeName || null,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }

  const req = {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    query: Object.fromEntries(url.searchParams.entries()),
    body: undefined,
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        req.body = await request.json();
      } catch {
        req.body = {};
      }
    } else {
      req.body = await request.text();
    }
  }

  const res = createResponse();

  try {
    const result = await route(req, res);

    if (result instanceof Response) {
      return result;
    }

    return new Response(
      JSON.stringify({
        error: "API handler completed without returning a response",
        route: routeName,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error(`API ${routeName} error:`, error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
