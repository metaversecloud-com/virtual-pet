import { getCredentials } from "../../getCredentials.js";
import { Visitor } from "../topiaInit.js";

export const getVisitor = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    return res.json({ visitor, success: true });
  } catch (error) {
    console.error("❌ Error getting the visitor", JSON.stringify(error));
    return res.status(500).send({ error, success: false });
  }
};
