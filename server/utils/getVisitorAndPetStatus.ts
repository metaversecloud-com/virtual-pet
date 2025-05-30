import { Credentials, IVisitor } from "../types/index.js";
import { errorHandler, getLevelAndAge, Visitor } from "./index.js";

export const getVisitorAndPetStatus = async (credentials: Credentials) => {
  try {
    const { urlSlug, visitorId } = credentials;

    const visitor = (await Visitor.get(visitorId, urlSlug, { credentials })) as IVisitor;

    await visitor.fetchDataObject();

    const { isAdmin } = visitor;

    if (!visitor.dataObject?.pet) {
      return {
        isAdmin,
        visitorHasPet: false,
        visitor,
      };
    }

    // this should be stored in the visitor data object moving forward but for backwards compatibility we need to also add it manually here
    const { currentLevel, experienceNeededForNextLevel, experienceNeededForTheLevelYouCurrentlyAchieved, petAge } =
      getLevelAndAge(visitor.dataObject?.pet?.experience || 0);

    return {
      isAdmin,
      petStatus: {
        ...visitor.dataObject?.pet,
        currentLevel,
        experienceNeededForNextLevel,
        experienceNeededForTheLevelYouCurrentlyAchieved,
        petAge,
      },
      visitorHasPet: true,
      visitor,
    };
  } catch (error) {
    return errorHandler({
      error,
      functionName: "getVisitorAndPetStatus",
      message: "Error getting visitor and pet status",
    });
  }
};
