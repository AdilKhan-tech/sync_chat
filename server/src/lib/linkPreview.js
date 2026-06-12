import { getLinkPreview } from "link-preview-js";

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export const extractFirstUrl = (text) => {
  if (!text) return null;
  const match = text.match(URL_REGEX);
  return match?.[0] || null;
};

export const fetchLinkPreview = async (url) => {
  try {
    const data = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: "follow",
    });
    return {
      url,
      title: data.title || "",
      description: data.description || "",
      image: data.images?.[0] || data.favicons?.[0] || "",
    };
  } catch {
    return null;
  }
};
