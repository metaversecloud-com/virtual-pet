import * as axios from 'axios';
import { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import jwt from 'jsonwebtoken';

type AnalyticType = {
    analyticName: string;
    incrementBy?: number;
    profileId?: string;
    uniqueKey?: string;
    urlSlug?: string;
};

type AssetType = {
    assetName: string;
    bottomLayerURL: string;
    creatorTags: {
        [key: string]: boolean;
    };
    tagJson: string;
    isPublic: true;
    topLayerURL: string;
};

type AnimationMetaType = {
    loop: boolean;
    x: number;
    y: number;
    hideLoop: boolean;
};
type FrameType = {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    sourceSize: {
        w: number;
        h: number;
    };
};

declare enum DroppedAssetClickType {
    NONE = "none",
    LINK = "link",
    PORTAL = "portal",
    TELEPORT = "teleport",
    WEBHOOK = "webhook"
}
declare enum DroppedAssetMediaType {
    NONE = "none",
    LINK = "link"
}
declare enum DroppedAssetMediaVolumeRadius {
    CLOSE = 0,
    MEDIUM = 1,
    FAR = 2,
    EVERYWHERE = 3
}
type DroppedAssetLinkType = {
    clickableLink: string;
    clickableLinkTitle?: string;
    isForceLinkInIframe?: boolean;
    isOpenLinkInDrawer?: boolean;
    existingLinkId?: string;
    linkSamlQueryParams?: string;
};

type InteractiveCredentials$1 = {
    apiKey?: string;
    assetId?: string;
    interactiveNonce?: string;
    interactivePublicKey?: string;
    profileId?: string | null;
    urlSlug?: string;
    visitorId?: number;
    iframeId?: string;
    gameEngineId?: string;
};

type AssetOptions = {
    attributes?: AssetInterface | undefined;
    credentials?: InteractiveCredentials$1 | undefined;
};
type DroppedAssetOptions = {
    attributes?: DroppedAssetInterface | undefined;
    credentials?: InteractiveCredentials$1 | undefined;
};
type UserOptions = {
    credentials?: InteractiveCredentials$1 | undefined;
};
type VisitorOptions = {
    attributes?: VisitorInterface | undefined;
    credentials?: InteractiveCredentials$1 | undefined;
};
type WorldOptions = {
    attributes?: WorldDetailsInterface | undefined;
    credentials?: InteractiveCredentials$1 | undefined;
};

type ResponseType$1 = {
    message?: string;
    statusCode?: number;
    success?: boolean;
};

/**
 * Create an instance of Scene class with a given scene id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Scene } from "utils/topiaInit.ts";
 *
 * const scene = await Scene.get(exampleSceneId, {
 *   attributes: { name: "My Scene" },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class Scene extends SDKController implements SceneInterface {
    readonly id: string;
    constructor(topia: Topia, id: string, options?: SceneOptionalInterface);
    /**
     * Retrieves scene details and assigns response data to the instance.
     *
     * @keywords get, fetch, retrieve, load, details, info, information, scene
     *
     * @example
     * ```ts
     * await scene.fetchSceneById();
     * const { name } = scene;
     * ```
     */
    fetchSceneById(): Promise<void | ResponseType$1>;
}

/**
 * Create an instance of Dropped Asset class with a given dropped asset id, url slug, and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { DroppedAsset } from "utils/topiaInit.ts";
 *
 * const droppedAsset = await DroppedAsset.get(exampleDroppedAssetId, exampleUrlSlug, {
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class DroppedAsset extends Asset implements DroppedAssetInterface {
    #private;
    readonly id?: string | undefined;
    dataObject?: object | null;
    isInteractive?: boolean | null;
    interactivePublicKey?: string | null;
    position: {
        x: number;
        y: number;
    };
    text?: string | null | undefined;
    urlSlug: string;
    constructor(topia: Topia, id: string, urlSlug: string, options?: DroppedAssetOptionalInterface);
    /**
     * Retrieves dropped asset details and assigns response data to the instance.
     *
     * @keywords get, fetch, retrieve, load, details, info, information
     *
     * @example
     * ```ts
     * await droppedAsset.fetchDroppedAssetById();
     * const { assetName } = droppedAsset;
     * ```
     */
    fetchDroppedAssetById(): Promise<void | ResponseType$1>;
    /**
     * Updates dropped asset details and assigns the response data to the instance. Requires Public Key to have the `canUpdateDroppedAssets` permission.
     *
     * @keywords update, modify, change, edit, alter, transform
     *
     * @example
     * ```ts
     * const payload = {
     * assetScale: 1,
     * clickType: "link",
     * clickableDisplayTextDescription: "Description",
     * clickableDisplayTextHeadline: "Headline",
     * clickableLink: "https://topia.io",
     * clickableLinkTitle: "Topia",
     * flipped: false,
     * isTextTopLayer: false,
     * layer0: "https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg",
     * layer1: "https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg",
     * position: { x: 0, y: 0 },
     * specialType: "webImage",
     * text: "My Asset",
     * textColor: "#000000",
     * textSize: 20,
     * textWeight: "normal",
     * textWidth: 200,
     * uniqueName: "example",
     * yOrderAdjust: 0,
     * }
     * await droppedAsset.updateDroppedAsset();
     * const { assetName } = droppedAsset;
     * ```
     */
    updateDroppedAsset({ assetScale, audioRadius, audioSliderVolume, clickType, clickableLink, clickableLinkTitle, clickableDisplayTextDescription, clickableDisplayTextHeadline, flipped, isInteractive, isTextTopLayer, isVideo, interactivePublicKey, layer0, layer1, mediaLink, mediaName, mediaType, portalName, position, specialType, syncUserMedia, text, textColor, textSize, textWeight, textWidth, uniqueName, yOrderAdjust, }: UpdateDroppedAssetInterface): Promise<void | ResponseType$1>;
    /**
     * Deletes the dropped asset (removes it from the world).
     *
     * @keywords remove, delete, erase, destroy, eliminate
     *
     * @example
     * ```ts
     * await droppedAsset.deleteDroppedAsset();
     * ```
     */
    deleteDroppedAsset(): Promise<void | ResponseType$1>;
    /**
     * Retrieves the data object for a dropped asset.
     *
     * @keywords get, fetch, retrieve, load, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const dataObject = await droppedAsset.fetchDataObject();
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
     */
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    /**
     * Sets the data object for a dropped asset and assigns the response data to the instance.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords set, assign, store, save, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await droppedAsset.setDataObject(
     *   { resetCount: 0 },
     *   {
     *     analytics: [{ analyticName: "resets"} ],
     *     lock: { lockId: `${assetId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
     *   },
     * );
     *
     * const { resetCount } = droppedAsset.dataObject;
     * ```
     */
    setDataObject(dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Updates the data object for a dropped asset and assigns the response data to the instance.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords update, modify, change, edit, alter, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await droppedAsset.updateDataObject({
     *   [`profiles.${profileId}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
     *   [`profileMapper.${profileId}`]: username,
     * });
     *
     * const { profiles } = droppedAsset.dataObject;
     * ```
     */
    updateDataObject(dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Increments a specific value in the data object for a dropped asset by the amount specified. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords increment, increase, add, count, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await droppedAsset.incrementDataObjectValue("key", 1);
     * ```
     */
    incrementDataObjectValue(path: string, amount: number, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Updates broadcast options for a dropped asset.
     *
     * @keywords broadcast, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateBroadcast({
     *   assetBroadcast: true,
     *   assetBroadcastAll: true,
     *   broadcasterEmail: "example@email.com"
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateBroadcast({ assetBroadcast, assetBroadcastAll, broadcasterEmail, }: UpdateBroadcastInterface): Promise<void | ResponseType$1>;
    /**
     * Updates click options for a dropped asset.
     *
     * @keywords click, link, interaction, url, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateClickType({
     *   "clickType": "portal",
     *   "clickableLink": "https://topia.io",
     *   "clickableLinkTitle": "My awesome link!",
     *   "clickableDisplayTextDescription": "Description",
     *   "clickableDisplayTextHeadline": "Title",
     *   "position": {
     *     "x": 0,
     *     "y": 0
     *   },
     *   "portalName": "community"
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateClickType({ clickType, clickableLink, clickableLinkTitle, clickableDisplayTextDescription, clickableDisplayTextHeadline, isForceLinkInIframe, isOpenLinkInDrawer, portalName, position, }: UpdateClickTypeInterface): Promise<void | ResponseType$1>;
    /**
     * Adds an array of links to an asset. Maximum is 20 links.
     *
     * @keywords links, multiple, clickable, urls, hyperlinks, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.setClickableLinkMulti({
     *   clickableLinks: [
     *     {
     *       clickableLink: "https://example_one.com",
     *       clickableLinkTitle: "Example One Link",
     *       isForceLinkInIframe: true,
     *       isOpenLinkInDrawer: false,
     *     },
     *     {
     *       clickableLink: "https://example two.com",
     *       clickableLinkTitle: "Example Two Link",
     *       isForceLinkInIframe: false,
     *       isOpenLinkInDrawer: false,
     *     },
     *   ],
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    setClickableLinkMulti({ clickableLinks }: SetClickableLinkMultiInterface): Promise<void | ResponseType$1>;
    /**
     * Updates multiple clickable links for a dropped asset.
     *
     * @remarks
     * Pass in an 'existingLinkId' to edit an existing link.
     *
     * @keywords links, multiple, clickable, urls, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateClickableLinkMulti({
     *   clickableLink: "https://example.com",
     *   clickableLinkTitle: "Example Link",
     *   isForceLinkInIframe: true,
     *   isOpenLinkInDrawer: false,
     *   existingLinkId: "abcd"
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateClickableLinkMulti({ clickableLink, clickableLinkTitle, isForceLinkInIframe, isOpenLinkInDrawer, existingLinkId, linkSamlQueryParams, }: UpdateClickableLinkMultiInterface): Promise<void | ResponseType$1>;
    /**
     * Removes a clickable link from a dropped asset.
     *
     * @keywords remove, delete, link, clickable, url, erase, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.removeClickableLink({ linkId: "link-id" });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    removeClickableLink({ linkId }: RemoveClickableLinkInterface): Promise<void | ResponseType$1>;
    /**
     * Updates text and style of a dropped asset.
     *
     * @keywords text, style, dropped asset settings
     *
     * @example
     * ```ts
     * const style = {
     *   "textColor": "#abc123",
     *   "textFontFamily": "Arial",
     *   "textSize": 40,
     *   "textWeight": "normal",
     *   "textWidth": 200
     * };
     * await droppedAsset.updateCustomTextAsset(style, "hello world");
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateCustomTextAsset(style: object | undefined | null, text: string | null | undefined): Promise<void | ResponseType$1>;
    /**
     * Updates media options for a dropped asset.
     *
     * @keywords media, video, audio, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateMediaType({
     *   "mediaType": "link",
     *   "mediaLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
     *   "isVideo": true,
     *   "syncUserMedia": true,
     *   "audioSliderVolume: 30"
     *   "portalName": "community",
     *   "audioRadius": 0,
     *   "mediaName": "string"
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateMediaType({ audioRadius, audioSliderVolume, isVideo, mediaLink, mediaName, mediaType, portalName, syncUserMedia, }: UpdateMediaTypeInterface): Promise<void | ResponseType$1>;
    /**
     * Updates mute zone options for a dropped asset.
     *
     * @keywords mute, zone, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateMuteZone(true);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateMuteZone(isMutezone: boolean): Promise<void | ResponseType$1>;
    /**
     * Updates landmark zone options for a dropped asset.
     *
     * @keywords landmark, zone, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateLandmarkZone({
     *  isLandmarkZoneEnabled: true,
     *  landmarkZoneName: "Example",
     *  landmarkZoneIsVisible: true,
     *});
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateLandmarkZone({ isLandmarkZoneEnabled, landmarkZoneName, landmarkZoneIsVisible, }: {
        isLandmarkZoneEnabled: boolean;
        landmarkZoneName?: string;
        landmarkZoneIsVisible?: boolean;
    }): Promise<void | ResponseType$1>;
    /**
     * Updates webhook zone options for a dropped asset.
     *
     * @keywords webhook, zone, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateWebhookZone(true);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateWebhookZone(isWebhookZoneEnabled: boolean): Promise<void | ResponseType$1>;
    /**
     * Moves a dropped asset to specified coordinates.
     *
     * @keywords position, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updatePosition(100, 200, 100);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updatePosition(x: number, y: number, yOrderAdjust?: number): Promise<void | ResponseType$1>;
    /**
     * Updates private zone options for a dropped asset.
     *
     * @keywords private, zone, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updatePrivateZone({
     *   "isPrivateZone": false,
     *   "isPrivateZoneChatDisabled": true,
     *   "privateZoneUserCap": 10
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updatePrivateZone({ isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap, }: UpdatePrivateZoneInterface): Promise<void | ResponseType$1>;
    /**
     * Updates the size of a dropped asset.
     *
     * @keywords size, scale, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.assetScale(.5);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateScale(assetScale: number): Promise<void | ResponseType$1>;
    /**
     * Flip an dropped asset.
     *
     * @keywords flip, layout, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.flip(.5);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    flip(): Promise<void | ResponseType$1>;
    /**
     * Change or remove media embedded in a dropped asset.
     *
     * @keywords media, update, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateUploadedMediaSelected("LVWyxwNxI96eLjnXWwYO");
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateUploadedMediaSelected(mediaId: string): Promise<void | ResponseType$1>;
    /**
     * Change or remove top and bottom layers of a dropped asset.
     *
     * @keywords layers, images, urls, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.updateWebImageLayers("","https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg");
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
     */
    updateWebImageLayers(bottom: string, top: string): Promise<void | ResponseType$1>;
    /**
     * Add a webhook to a dropped asset
     *
     * @keywords webhook, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.addWebhook({
     *   dataObject: {},
     *   description: "Webhook desc",
     *   enteredBy: "you",
     *   isUniqueOnly: false,
     *   title: "title",
     *   type: "type",
     *   url: "https://url.com",
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the new `webhookId` or an error.
     */
    addWebhook({ dataObject, description, isUniqueOnly, shouldSetClickType, shouldSetIsInteractive, title, type, url, }: {
        dataObject: object;
        description: string;
        isUniqueOnly: boolean;
        shouldSetClickType?: boolean;
        shouldSetIsInteractive?: boolean;
        title: string;
        type: string;
        url: string;
    }): Promise<void | AxiosResponse>;
    /**
     * Set the interactive settings on a dropped asset
     *
     * @keywords interactive, dropped asset settings
     *
     * @example
     * ```ts
     * await droppedAsset.setInteractiveSettings({
     *   isInteractive: true,
     *   interactivePublicKey: "xyz"
     * });
     * ```
     */
    setInteractiveSettings({ isInteractive, interactivePublicKey, }: {
        isInteractive?: boolean;
        interactivePublicKey: string;
    }): Promise<void | ResponseType$1>;
    /**
     * Retrieve analytics for a dropped asset by day, week, month, quarter, or year
     *
     * @keywords get, fetch, retrieve, load, analytics
     *
     * @example
     * ```ts
     * const analytics = await droppedAsset.fetchDroppedAssetAnalytics({
     *   periodType: "quarter",
     *   dateValue: 3,
     *   year: 2023,
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the analytics data or an error.
     */
    fetchDroppedAssetAnalytics({ periodType, dateValue, year, }: {
        periodType: "week" | "month" | "quarter" | "year";
        dateValue: number;
        year: number;
    }): Promise<void | ResponseType$1>;
}

/**
 * Create an instance of World class with a given url slug and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { World } from "utils/topiaInit.ts";
 *
 * const world = await World.create(exampleUrlSlug, {
 *   attributes: { name: "Example World" },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class World extends SDKController implements WorldInterface {
    #private;
    urlSlug: string;
    dataObject?: object | null | undefined;
    sceneDropIds?: [string] | null | undefined;
    scenes?: [string] | null | undefined;
    webhooks?: WorldWebhooksInterface | null | undefined;
    constructor(topia: Topia, urlSlug: string, options?: WorldOptionalInterface);
    get droppedAssets(): {
        [key: string]: DroppedAsset;
    };
    /**
     * Retrieves details of a world.
     *
     * @keywords get, fetch, retrieve, details, info, information, world
     *
     * @example
     * ```ts
     * await world.fetchDetails();
     * const { name } = world;
     * ```
     */
    fetchDetails(): Promise<void | ResponseType$1>;
    /**
     * Update details of a world.
     *
     * @keywords update, modify, change, edit, world, settings, details
     *
     * @example
     * ```ts
     * await world.updateDetails({
     *   controls: {
     *     allowMuteAll: true,
     *     disableHideVideo: true,
     *     isMobileDisabled: false,
     *     isShowingCurrentGuests: false,
     *   },
     *   description: 'Welcome to my world.',
     *   forceAuthOnLogin: false,
     *   height: 2000,
     *   name: 'Example',
     *   spawnPosition: { x: 100, y: 100 },
     *   width: 2000
     * });
     *
     * const { name, description } = world;
     * ```
     */
    updateDetails({ controls, description, forceAuthOnLogin, height, name, spawnPosition, width, }: WorldDetailsInterface): Promise<void | ResponseType$1>;
    /**
     * Set close world settings
     *
     * @keywords update, modify, change, edit, world, settings, details, close, closed
     *
     * @example
     * ```ts
     * await world.updateCloseWorldSettings({
     *   controls: {
     *     allowMuteAll: true,
     *     disableHideVideo: true,
     *     isMobileDisabled: false,
     *     isShowingCurrentGuests: false,
     *   },
     *   description: 'Welcome to my world.',
     *   forceAuthOnLogin: false,
     *   height: 2000,
     *   name: 'Example',
     *   spawnPosition: { x: 100, y: 100 },
     *   width: 2000
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    updateCloseWorldSettings({ closeWorldDescription, isWorldClosed, }: {
        closeWorldDescription: string;
        isWorldClosed: boolean;
    }): Promise<void | ResponseType$1>;
    /**
     * Retrieve all assets dropped in a world.
     *
     * @keywords get, fetch, retrieve, list, current, dropped assets
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * await world.fetchDroppedAssets();
     * const assets = world.droppedAssets;
     * ```
     */
    fetchDroppedAssets(): Promise<void | ResponseType$1>;
    /**
     * Retrieve all assets dropped in a world matching uniqueName.
     *
     * @keywords get, fetch, retrieve, list, current, dropped assets, uniqueName
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({ uniqueName: "exampleUniqueName", isPartial: true });
     * ```
     *
     * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
     */
    fetchDroppedAssetsWithUniqueName({ uniqueName, isPartial, isReversed, }: {
        uniqueName: string;
        isPartial?: boolean;
        isReversed?: boolean;
    }): Promise<DroppedAsset[]>;
    /**
     * Retrieve all assets dropped in a world matching sceneDropId.
     *
     * @keywords get, fetch, retrieve, list, current, dropped assets, sceneDropId
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * const droppedAssets = await world.fetchDroppedAssetsBySceneDropId({
     *   sceneDropId: "sceneDropIdExample",
     *   uniqueName: "optionalUniqueNameExample",
     * });
     * ```
     *
     * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
     */
    fetchDroppedAssetsBySceneDropId({ sceneDropId, uniqueName, }: {
        sceneDropId: string;
        uniqueName?: string;
    }): Promise<DroppedAsset[]>;
    /**
     * Update multiple custom text dropped assets with a single style while preserving text for specified dropped assets only.
     *
     * @keywords update, modify, change, edit, dropped assets, custom text, style, text
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * const droppedAssetsToUpdate = [world.droppedAssets["6"], world.droppedAssets["12"]];
     * const style = {
     *   "textColor": "#abc123",
     *   "textFontFamily": "Arial",
     *   "textSize": 40,
     *   "textWeight": "normal",
     *   "textWidth": 200
     * };
     * await world.updateCustomText(droppedAssetsToUpdate, style);
     * ```
     *
     * @returns
     * Updates each DroppedAsset instance and world.droppedAssets map.
     */
    updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object>;
    /**
     * Retrieve all landmark zone assets dropped in a world.
     *
     * @keywords get, fetch, retrieve, list, landmark, zones, dropped assets
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * const zones = await world.fetchLandmarkZones("optionalLandmarkZoneName", "optionalSceneDropIdExample");
     * ```
     *
     * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
     */
    fetchLandmarkZones(landmarkZoneName?: string, sceneDropId?: string): Promise<DroppedAsset[]>;
    /**
     * @deprecated Use {@link fetchScenes} instead.
     *
     * Fetch a list of all scene drop ids in a world that include at least one asset with an interactivePublicKey
     *
     * @example
     * ```ts
     * await world.fetchSceneDropIds();
     * ```
     *
     * @returns
     * ```ts
     * { sceneDropIds: [] }
     * ```
     */
    fetchSceneDropIds(): Promise<object | ResponseType$1>;
    /**
     * Fetch a list of all scene drop ids and dropped assets in a world
     *
     * @keywords get, fetch, retrieve, list, scenes
     *
     * @category Scenes
     *
     * @example
     * ```ts
     * await world.fetchScenes();
     * ```
     *
     * @returns
     * ```ts
     * { "scenes": {
     *     "sceneDropId_1": {
     *         "droppedAssets": {
     *             "droppedAssetId_1": {
     *                 "metaName": "hello"
     *                 "metaNameReversed": "olleh"
     *             },
     *             "droppedAssetId_2": {
     *                 "metaName": "world"
     *                 "metaNameReversed": "dlorw"
     *             }
     *         }
     *     },
     *   }
     * }
     * ```
     */
    fetchScenes(): Promise<object | ResponseType$1>;
    /**
     * Drops a scene in a world and returns sceneDropId.
     *
     * @keywords drop, add, place, scene
     *
     * @category Scenes
     *
     * @example
     * ```ts
     * await world.dropScene({
     *   "sceneId": "string",
     *   "position": {
     *     "x": 0,
     *     "y": 0
     *   },
     *   "assetSuffix": "string"
     * });
     * ```
     *
     * @returns
     * ```ts
     * { sceneDropId: sceneId-timestamp, success: true }
     * ```
     */
    dropScene({ allowNonAdmins, assetSuffix, position, sceneDropId, sceneId, }: {
        allowNonAdmins?: boolean;
        assetSuffix?: string;
        position: object;
        sceneDropId?: string;
        sceneId: string;
    }): Promise<ResponseType$1>;
    /**
     * Replace the current scene of a world.
     *
     * @keywords replace, change, scene
     *
     * @category Scenes
     *
     * @example
     * ```ts
     * const droppedAssetsToUpdate = [world.droppedAssets["6"], world.droppedAssets["12"]]
     * const style = {
     *   "textColor": "#abc123",
     *   "textFontFamily": "Arial",
     *   "textSize": 40,
     *   "textWeight": "normal",
     *   "textWidth": 200
     * }
     * await world.replaceScene(SCENE_ID);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    replaceScene(sceneId: string): Promise<void | ResponseType$1>;
    /**
     * Get all particles available
     *
     * @keywords get, fetch, retrieve, list, particles
     *
     * @category Particles
     *
     * @example
     * ```ts
     * await world.getAllParticles();
     *
     * @returns {Promise<ResponseType>} Returns an array of particles or an error response.
     * ```
     */
    getAllParticles(): Promise<object | ResponseType$1>;
    /**
     * Trigger a particle effect at a position in the world
     *
     * @keywords trigger, start, play, particle, effect
     *
     * @category Particles
     *
     * @example
     * ```ts
     * const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });
     *
     * await world.triggerParticle({ name: "Flame", duration: 5, position: droppedAsset.position });
     * ```
     *
     * @returns {Promise<ResponseType | string>} Returns `{ success: true }` or a message if no particleId is found.
     */
    triggerParticle({ id, name, duration, position, }: {
        id?: string;
        name?: string;
        duration?: number;
        position?: object;
    }): Promise<ResponseType$1 | string>;
    /**
     * Add an activity to a world
     * excludeFromNotification is an array of visitorIds to exclude from the notification
     *
     * @keywords start, trigger, activity
     *
     * @example
     * ```ts
     * await world.triggerActivity({ type: "GAME_ON", assetId: "abc123" });
     * ```
     *
     * @returns {Promise<ResponseType | string>} Returns the `activityId` or an error response.
     */
    triggerActivity({ type, assetId, excludeFromNotification, }: {
        type: WorldActivityType;
        assetId: string;
        excludeFromNotification?: (string | number)[];
    }): Promise<ResponseType$1 | string>;
    /**
     * Display a message via a toast to all visitors currently in a world.
     *
     * @keywords send, display, show, toast, message, notification
     *
     * @example
     * ```ts
     * await world.fireToast({
     *   groupId: "custom-message",
     *   title: "Hello World",
     *   text: "Thank you for participating!",
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType$1>;
    /**
     * Retrieves the data object for a world. Must have valid interactive credentials from a visitor in the world.
     *
     * @keywords get, fetch, retrieve, load, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await world.fetchDataObject();
     * const { dataObject } = world;
     * ```
     */
    fetchDataObject: (appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string) => Promise<void | ResponseType$1>;
    /**
     * Sets the data object for a user. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords set, assign, store, save, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
      await world.setDataObject(
        {
          ...defaultGameData,
          keyAssetId: droppedAsset.id,
        },
        { lock: { lock: { lockId: `${keyAssetId}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` }, releaseLock: true } },
      );
     * const { profileMapper } = world.dataObject;
     * ```
     */
    setDataObject: (dataObject: object | null | undefined, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }) => Promise<void | ResponseType$1>;
    /**
     * Updates the data object for a world. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords update, modify, change, edit, alter, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await world.updateDataObject({
     *   [`keyAssets.${keyAssetId}.itemsCollectedByUser.${profileId}`]: { [dateKey]: { count: 1 }, total: 1 },
     *   [`profileMapper.${profileId}`]: username,
     * });
     * const { profileMapper } = world.dataObject;
     * ```
     */
    updateDataObject: (dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }) => Promise<void | ResponseType$1>;
    /**
     * Increments a specific value in the data object for a world by the amount specified. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords increment, increase, add, count, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await world.incrementDataObjectValue([`keyAssets.${keyAssetId}.totalItemsCollected.count`], 1);
     * ```
     */
    incrementDataObjectValue(path: string, amount: number, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Retrieve all webhooks in a world.
     *
     * @keywords get, fetch, retrieve, list, current, webhooks
     *
     * @category Webhooks
     *
     * @example
     * ```ts
     * await world.fetchWebhooks();
     * const webhooks = world.webhooks;
     * ```
     */
    fetchWebhooks(): Promise<void | ResponseType$1>;
    /**
     * Retrieve world analytics by day, week, month, quarter, or year
     *
     * @keywords get, fetch, retrieve, analytics, stats, statistics, data, metrics
     *
     * @category Analytics
     *
     * @example
     * ```ts
     * const analytics = await world.fetchWorldAnalytics({
     *   periodType: "week",
     *   dateValue: 40,
     *   year: 2023,
     * });
     * ```
     */
    fetchWorldAnalytics({ periodType, dateValue, year, }: {
        periodType: "week" | "month" | "quarter" | "year";
        dateValue: number;
        year: number;
    }): Promise<void | ResponseType$1>;
}

/**
 * Controller for a user's owned inventory item.
 *
 * @remarks
 * This class should be instantiated via UserInventoryItemFactory only.
 *
 * @property inventoryItemId - The root inventory item's id
 */
declare class UserInventoryItem extends InventoryItem implements UserInventoryItemInterface {
    userItemId: string;
    user_id: string;
    item_id: string;
    quantity: number;
    created_at?: Date;
    updated_at?: Date;
    metadata?: object | null;
    grant_source: string;
    type: string;
    constructor(topia: Topia, id: string, options?: UserInventoryItemOptionalInterface);
    /**
     * Fetches the user inventory item details from the platform and assigns them to this instance.
     *
     * @example
     * ```ts
     * await userInventoryItem.fetchUserInventoryItemById();
     * ```
     *
     * @returns {Promise<void>} Returns when the item has been fetched and assigned.
     */
    fetchUserInventoryItemById(): Promise<void>;
}

/**
 * InventoryItem represents an item in a user's inventory.
 *
 * @remarks
 * This class should be instantiated via InventoryFactory only.
 *
 * @keywords inventory, item, asset, object
 */
declare class InventoryItem extends SDKController implements InventoryItemInterface {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    created_at?: Date;
    updated_at?: Date;
    metadata?: object | null;
    image_path?: string;
    interactive_key_id?: string;
    status?: string;
    constructor(topia: Topia, id: string, options?: InventoryItemOptionalInterface);
    /**
     * Fetches the inventory item details from the platform and assigns them to this instance.
     *
     * @example
     * ```ts
     * await item.fetchInventoryItemById();
     * ```
     *
     * @returns {Promise<InventoryItem>} Returns when the item has been fetched and assigned.
     */
    fetchInventoryItemById(): Promise<InventoryItem>;
}

/**
 * Create an instance of User class with optional session credentials.
 *
 * @example
 * ```ts
 * import { User } from "utils/topiaInit.ts";
 *
 * const user = await User.create({
 *   profileId: "exampleProfileId",
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", profileId: "exampleProfileId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class User extends SDKController implements UserInterface {
    #private;
    profileId?: string | null;
    dataObject?: object | null | undefined;
    profile?: Record<string, any>;
    constructor(topia: Topia, options?: UserOptionalInterface);
    get adminWorlds(): {
        [key: string]: World;
    };
    get assets(): {
        [key: string]: Asset;
    };
    get scenes(): {
        [key: string]: Scene;
    };
    get worlds(): {
        [key: string]: World;
    };
    checkInteractiveCredentials(): Promise<void | ResponseType$1>;
    /**
     * Returns all avatars owned by User
     *
     * @keywords get, fetch, retrieve, list, avatars, characters
     *
     * @category Avatars
     *
     * @example
     * ```ts
     * const avatars = await user.fetchAvatars();
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the avatars or an error.
     */
    fetchAvatars(): Promise<void | ResponseType$1>;
    /**
     * Add a new avatar
     *
     * @keywords add, create, upload, avatar, character
     *
     * @category Avatars
     *
     * @example
     * ```ts
     * const animationMeta = {
     *   "emote": { "loop": false, "x": 0, "y": 0, "hideLoop": true }
     * }
     *
     * const spriteSheetJSON = {
     *   "animations": {
     *     "emote": [
     *       "emote/1.png"
     *     ]
     *   },
     *   "frames": {
     *     "emote/1.png": {
     *       "frame": {
     *        "x": 1911,
     *        "y": 778,
     *        "w": 58,
     *        "h": 91
     *      },
     *      "rotated": true,
     *      "trimmed": true,
     *      "spriteSourceSize": {
     *        "x": 50,
     *        "y": 33,
     *        "w": 58,
     *        "h": 91
     *      },
     *      "sourceSize": {
     *        "w": 159,
     *        "h": 159
     *      }
     *    }
     *  },
     *  "spriteSheetTypeMeta": {
     *    "nameplate": {
     *      "x": 0,
     *      "y": -70
     *    }
     *  },
     *  "meta": {
     *    "image": "spriteSheets%2FTvHNjgoMkiErDNSrVqHU%2FspriteSheet.png?alt=media",
     *    "format": "RGBA8888",
     *    "size": {
     *      "w": 2006,
     *      "h": 1099
     *    },
     *    "scale": "1"
     *  }
     * }
     *
     * const formData = new FormData();
     * formData.append('animationMeta', animationMeta);
     * formData.append('name', "ExampleAvatarName");
     * formData.append('spriteSheetJSON', spriteSheetJSON);
     * formData.append('expression_dance', expression_dance);
     * formData.append('expression_emote', expression_emote);
     * formData.append('expression_sit', expression_sit);
     * formData.append('expression_stand', expression_stand);
     * formData.append('expression_transport', expression_transport);
     * formData.append('preview', preview);
     * formData.append('spriteSheet', spriteSheet);
     * formData.append('unityPackage', unityPackage);
     * await user.uploadAvatarFiles("exampleAvatarId", formData);
     * ```
     */
    addAvatar(formData: FormData): Promise<void | ResponseType$1>;
    /**
     * Update avatar and sprite sheet records and upload files to existing sprite sheet and avatar storage buckets
     *
     * @keywords update, modify, change, edit, avatar, character
     *
     * @category Avatars
     *
     * @example
     * ```ts
     * const animationMeta = {
     *   "emote": { "loop": false, "x": 0, "y": 0, "hideLoop": true }
     * }
     *
     * const spriteSheetJSON = {
     *   "animations": {
     *     "emote": [
     *       "emote/1.png"
     *     ]
     *   },
     *   "frames": {
     *     "emote/1.png": {
     *       "frame": {
     *        "x": 1911,
     *        "y": 778,
     *        "w": 58,
     *        "h": 91
     *      },
     *      "rotated": true,
     *      "trimmed": true,
     *      "spriteSourceSize": {
     *        "x": 50,
     *        "y": 33,
     *        "w": 58,
     *        "h": 91
     *      },
     *      "sourceSize": {
     *        "w": 159,
     *        "h": 159
     *      }
     *    }
     *  },
     *  "spriteSheetTypeMeta": {
     *    "nameplate": {
     *      "x": 0,
     *      "y": -70
     *    }
     *  },
     *  "meta": {
     *    "image": "spriteSheets%2FTvHNjgoMkiErDNSrVqHU%2FspriteSheet.png?alt=media",
     *    "format": "RGBA8888",
     *    "size": {
     *      "w": 2006,
     *      "h": 1099
     *    },
     *    "scale": "1"
     *  }
     * }
     *
     * const formData = new FormData();
     * formData.append('animationMeta', animationMeta);
     * formData.append('name', "ExampleAvatarName");
     * formData.append('spriteSheetJSON', spriteSheetJSON);
     * formData.append('expression_dance', expression_dance);
     * formData.append('expression_emote', expression_emote);
     * formData.append('expression_sit', expression_sit);
     * formData.append('expression_stand', expression_stand);
     * formData.append('expression_transport', expression_transport);
     * formData.append('preview', preview);
     * formData.append('spriteSheet', spriteSheet);
     * formData.append('unityPackage', unityPackage);
     * await user.uploadAvatarFiles("exampleAvatarId", formData);
     * ```
     */
    updateAvatar(avatarId: string, formData: FormData): Promise<void | ResponseType$1>;
    /**
     * Update avatar and sprite sheet records and upload files to existing sprite sheet and avatar storage buckets
     *
     * @keywords delete, remove, erase, destroy, eliminate, avatar
     *
     * @category Avatars
     *
     * @example
     * ```ts
     * await user.deleteAvatar("exampleAvatarId");
     * ```
     */
    deleteAvatar(avatarId: string): Promise<void | ResponseType$1>;
    /**
     * Returns all assets owned by User when an email address is provided.
     *
     * @keywords get, fetch, retrieve, list, user assets, objects
     *
     * @category Assets
     *
     * @example
     * ```ts
     * await user.fetchAssets();
     * const userAssets = user.assets;
     * ```
     */
    fetchAssets(): Promise<void | ResponseType$1>;
    /**
     * Returns all platform assets.
     *
     * @keywords get, fetch, retrieve, list, platform assets, objects
     *
     * @category Assets
     *
     * @example
     * ```ts
     * const assets = await user.fetchPlatformAssets();
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the platform assets or an error response.
     */
    fetchPlatformAssets(): Promise<object | ResponseType$1>;
    /**
     * Returns all scenes owned by User.
     *
     * @keywords get, fetch, retrieve, list, user scenes
     *
     * @category Scenes
     *
     * @example
     * ```ts
     * await user.fetchScenes();
     * const userScenes = user.scenes;
     * ```
     */
    fetchScenes(): Promise<void | ResponseType$1>;
    /**
     * Retrieves all worlds owned by user with matching API Key, creates a new World object for each, and creates new map of Worlds accessible via user.worlds.
     *
     * @keywords get, fetch, retrieve, list, user worlds
     *
     * @category Worlds
     *
     * @example
     * ```ts
     * await user.fetchWorldsByKey();
     * const userWorlds = user.worlds;
     * ```
     *
     * @returns
     * ```ts
     * { urlSlug: new World({ apiKey, worldArgs, urlSlug }) }
     * ```
     */
    fetchWorldsByKey(): Promise<void | ResponseType$1>;
    /**
     * Retrieves all worlds a user with matching API Key is an admin in, creates a new World object for each, and creates new map of Worlds accessible via user.adminWorlds.
     *
     * @keywords get, fetch, retrieve, list, admin worlds, user worlds
     *
     * @category Worlds
     *
     * @example
     * ```ts
     * await user.fetchAdminWorldsByKey();
     * const adminWorlds = user.adminWorlds;
     * ```
     */
    fetchAdminWorldsByKey(): Promise<void | ResponseType$1>;
    /**
     * Retrieves ids of all dropped assets in all worlds with a matching interactivePublicKey.
     *
     * @keywords get, fetch, retrieve, list, interactive worlds, public key
     *
     * @category Dropped Assets
     *
     * @example
     * ```ts
     * await user.fetchInteractiveWorldsByKey("interactivePublicKeyExample");
     * const interactiveWorlds = user.interactiveWorlds;
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the `urlSlugs` of worlds where the Public Key is found or an error response.
     */
    fetchInteractiveWorldsByKey(interactivePublicKey: string): Promise<object | ResponseType$1>;
    /**
     * Send an email
     *
     * @keywords send, email, message, notify
     *
     * @example
     * ```ts
     * const html = `<p><b>Hello World!</b></p><p>This email is being sent from via SDK.</p>`
     * await user.sendEmail({ html, subject: "Example", to: "example@email.io" });
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns `{ success: true }` if the email is sent successfully or an error response.
     */
    sendEmail({ html, subject, to, }: {
        html: string;
        subject: string;
        to: string;
    }): Promise<object | ResponseType$1>;
    /**
     * Get expressions
     *
     * @keywords get, fetch, retrieve, list, expressions, emotes
     *
     * @category Expressions
     *
     * @example
     * ```ts
     * await user.getExpressions({ getUnlockablesOnly: true, });
     * ```
     *
     * @returns {Promise<ResponseType>} Returns an array of expressions or an error response.
     */
    getExpressions({ name, getUnlockablesOnly, }: {
        name?: string;
        getUnlockablesOnly?: boolean;
    }): Promise<ResponseType$1>;
    /**
     * Retrieves the data object for a user.
     *
     * @keywords get, fetch, retrieve, load, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const dataObject = await user.fetchDataObject();
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
     */
    fetchDataObject(appPublicKey?: string, appJWT?: string): Promise<void | ResponseType$1>;
    /**
     * Sets the data object for a user.
     *
     * @keywords set, assign, store, save, data, object, state
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await user.setDataObject(
     *   { itemsCollected: 0 },
     *   {
     *     analytics: [{ analyticName: "resets"} ],
     *     lock: { lockId: `${assetId}-${itemsCollected}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
     *   },
     * );
     *
     * const { itemsCollected } = user.dataObject;
     * ```
     */
    setDataObject(dataObject: object | null | undefined, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Updates the data object for a user.
     *
     * @keywords update, modify, change, edit, alter, data, object, state
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const theme = "exampleTheme";
     *
     * await user.updateDataObject({
     *   [`${theme}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
     * });
     *
     * const { exampleTheme } = user.dataObject;
     * ```
     */
    updateDataObject(dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Increments a specific value in the data object for a user by the amount specified. Must have valid interactive credentials from a visitor in the world.
     *
     * @keywords increment, increase, add, count, data, object, state
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await user.incrementDataObjectValue("key", 1);
     * ```
     */
    incrementDataObjectValue(path: string, amount: number, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Retrieves all inventory items owned by this user and app's key.
     *
     * @keywords get, fetch, retrieve, list, inventory, items, user
     *
     * @example
     * ```ts
     * const items = await user.fetchInventoryItems();
     * ```
     *
     * @returns {Promise<void>} Returns an array of InventoryItem objects.
     */
    fetchInventoryItems(): Promise<void>;
    get inventoryItems(): UserInventoryItem[];
    /**
     * Grants an inventory item to this user.
     *
     * @param item The InventoryItem to modify.
     * @param quantity The new quantity to set.
     *
     * @example
     * ```ts
     * const items = await user.grantInventoryItem("item-id-123", 2);
     * ```
     *
     * @returns {Promise<UserInventoryItem>} Returns the UserInventoryItem granted.
     */
    grantInventoryItem(item: InventoryItem, quantity?: number): Promise<UserInventoryItem>;
    /**
     * Modifies the quantity of an inventory item in this user's inventory.
     *
     * @param item The UserInventoryItem to modify.
     * @param quantity The new quantity to set.
     *
     * @example
     * ```ts
     * await user.modifyInventoryItemQuantity("item-id-123", 5);
     * ```
     *
     * @returns {Promise<UserInventoryItem>} Returns the updated inventory or a response object.
     */
    modifyInventoryItemQuantity(item: UserInventoryItem, quantity: number): Promise<UserInventoryItem>;
}

/**
 * Create an instance of Visitor class with a given id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Visitor } from "utils/topiaInit.ts";
 *
 * const visitor = await Visitor.get(visitorId, urlSlug, { attributes: { moveTo: { x: 0, y: 0 } }, credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", profileId: "exampleProfileId", visitorId: 1, urlSlug: "exampleUrlSlug" } });
 * ```
 */
declare class Visitor extends User implements VisitorInterface {
    #private;
    readonly id: number;
    urlSlug: string;
    user?: User;
    constructor(topia: Topia, id: number, urlSlug: string, options?: VisitorOptionalInterface);
    /**
     * Get a single visitor from a world
     *
     * @keywords get, fetch, retrieve, load, visitor, details
     *
     * @example
     * ```ts
     * await visitor.fetchVisitor();
     * ```
     *
     * @returns
     * Returns details for a visitor in a world by id and urlSlug
     */
    fetchVisitor(): Promise<void | ResponseType$1>;
    /**
     * Teleport or walk a visitor currently in a world to a single set of coordinates.
     *
     * @keywords move, teleport, walk, position, coordinate, location, place
     *
     * @example
     * ```ts
     * await visitor.moveVisitor({
     *   shouldTeleportVisitor: true,
     *   x: 100,
     *   y: 100,
     * });
     * ```
     *
     * @returns
     * Returns `{ success: true }` if the visitor was moved successfully.
     */
    moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType$1>;
    /**
     * Display a message via a toast to a visitor currently in a world.
     *
     * @keywords toast, message, notification, alert, display, show, popup
     *
     * @example
     * ```ts
     * await visitor.fireToast({
     *   groupId: "custom-message",
     *   title: "Hello World",
     *   text: "Thank you for participating!",
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType$1>;
    /**
     * Open an iframe in a drawer or modal for a visitor currently in a world.
     *
     * @keywords open, iframe, drawer, modal, link, url, website, web page
     *
     * @category iframes
     *
     * @example
     * ```ts
     * await visitor.openIframe({
     *   droppedAssetId: "droppedAssetId",
     *   link: "https://topia.io",
     *   shouldOpenInDrawer: true,
     *   title: "Hello World",
     * });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    openIframe({ droppedAssetId, link, shouldOpenInDrawer, title, }: OpenIframeInterface): Promise<void | ResponseType$1>;
    /**
     * Reload an iframe for a visitor currently in a world.
     *
     * @keywords reload, iframe, drawer, modal, link, url, website, web page
     *
     * @category iframes
     *
     * @example
     * ```ts
     * await visitor.reloadIframe("droppedAssetId");
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    reloadIframe(droppedAssetId: string): Promise<void | ResponseType$1>;
    /**
     * Close an iframe for a visitor currently in a world.
     *
     * @keywords close, iframe, drawer, modal
     *
     * @category iframes
     *
     * @example
     * ```ts
     * await visitor.closeIframe("droppedAssetId");
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    closeIframe(droppedAssetId: string): Promise<void | ResponseType$1>;
    /**
     * Mute and turn video off for a visitor currently in a world.
     *
     * @keywords mute, video, av, turn off, disable
     *
     * @example
     * ```ts
     * await visitor.turnAVOff();
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
     */
    turnAVOff(): Promise<void | ResponseType$1>;
    /**
     * Get expressions
     *
     * @keywords get, fetch, retrieve, list, expressions, emotes
     *
     * @category Expressions
     *
     * @example
     * ```ts
     * await visitor.getExpressions({ getUnlockablesOnly: true, });
     * ```
     * @returns {Promise<ResponseType>} Returns an array of expressions or an error response.
     */
    getExpressions({ name, getUnlockablesOnly, }: {
        name?: string;
        getUnlockablesOnly?: boolean;
    }): Promise<ResponseType$1>;
    /**
     * Grant expression to a visitor by id or name.
     *
     * @keywords grant, give, add, expression, emote
     *
     * @category Expressions
     *
     * @example
     * ```ts
     * await visitor.grantExpression({ id: "exampleExpressionId" });
     * await visitor.grantExpression({ name: "exampleExpressionName" });
     * ```
     *
     * @returns {Promise<ResponseType>} Returns `{ success: true }` if the expression was granted successfully or an error response.
     */
    grantExpression({ id, name }: {
        id?: string;
        name?: string;
    }): Promise<ResponseType$1>;
    /**
     * Get all particles available
     *
     * @keywords get, fetch, retrieve, list, particles, effects
     *
     * @category Particle Effects
     *
     * @example
     * ```ts
     * await visitor.getAllParticles();
     * ```
     *
     * @returns {Promise<ResponseType>} Returns an array of particles or an error response.
     */
    getAllParticles(): Promise<ResponseType$1>;
    /**
     * Trigger a particle effect on a visitor
     *
     * @keywords trigger, particle, effect, spawn, start, play
     *
     * @category Particle Effects
     *
     * @example
     * ```ts
     * await visitor.triggerParticle({ name: "Flame" });
     * ```
     *
     * @returns {Promise<ResponseType | string>} Returns `{ success: true }` or a message if no particleId is found.
     */
    triggerParticle({ id, name, duration, }: {
        id?: string;
        name?: string;
        duration?: number;
    }): Promise<ResponseType$1 | string>;
    /**
     * Retrieves the data object for a visitor.
     *
     * @keywords get, fetch, retrieve, load, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const dataObject = await visitor.fetchDataObject();
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
     */
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    /**
     * Sets the data object for a visitor.
     *
     * @keywords set, assign, store, save, data, object, state
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await visitor.setDataObject(
     *   { itemsCollected: 0 },
     *   {
     *     analytics: [{ analyticName: "resets"} ],
     *     lock: { lockId: `${assetId}-${itemsCollected}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
     *   },
     * );
     *
     * const { itemsCollected } = visitor.dataObject;
     * ```
     */
    setDataObject(dataObject: object | null | undefined, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Updates the data object for a visitor.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords update, modify, change, edit, alter, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const theme = "exampleTheme";
     *
     * await visitor.updateDataObject({
     *   [`${theme}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
     * });
     *
     * const { exampleTheme } = visitor.dataObject;
     * ```
     */
    updateDataObject(dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Increments a specific value in the data object for a visitor by the amount specified. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords increment, increase, add, count, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await visitor.incrementDataObjectValue("key", 1);
     * ```
     */
    incrementDataObjectValue(path: string, amount: number, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Update analytics for a given public key. Must have valid interactive credentials from a visitor in the world.
     *
     * @keywords update, modify, change, edit, analytics, analytic, stats, statistics, data
     *
     * @example
     * ```ts
     * await visitor.updatePublicKeyAnalytics([{ analyticName: "joins", profileId, uniqueKey: profileId, urlSlug }]);
     * ```
     */
    updatePublicKeyAnalytics(analytics?: AnalyticType[]): Promise<void | ResponseType$1>;
    /**
     * Setup signal to visitor
     *
     * @keywords signal, webrtc, answer, connect, p2p
     *
     * @example
     * ```ts
     * await visitor.sendSignalToVisitor(iceServers);
     * ```
     */
    sendSignalToVisitor(signal: any): Promise<void | (ResponseType$1 & {
        answerSignal: any;
    })>;
    /**
     * Retrieves all inventory items owned by this visitor and app's key.
     *
     * @keywords get, fetch, retrieve, list, inventory, items, visitor
     *
     * @example
     * ```ts
     * const items = await visitor.fetchInventoryItems();
     * ```
     *
     * @returns {Promise<void>} Returns an array of InventoryItem objects.
     */
    fetchInventoryItem(item: InventoryItem): Promise<UserInventoryItem>;
    /**
     * Get's a following avatar for this visitor, if one exists.
     *
     * @example
     * ```ts
     * await visitor.getFollowingAvatar();
     * ```
     *
     * @returns {Promise<Visitor | null>} Returns a Visitor object representing the following avatar.
     */
    getFollowingAvatar(): Promise<Visitor | null>;
    /**
     * Gives this visitor a following avatar. One following avatar is allowed per visitor, per application public key.
     *
     * @param name The ID of the inventory item to modify.
     * @param avatarImageUrl The new quantity to set.
     *
     * @example
     * ```ts
     * await visitor.addFollowingAvatar("george", "https://example.com/avatar-george.png");
     * ```
     *
     * @returns {Promise<Visitor>} Returns nothing if successful.
     */
    addFollowingAvatar(name: string, avatarImageUrl: string, height: number, width: number): Promise<Visitor>;
    /**
     * Deletes whichever following avatar this app has assigned to this visitor.
     *
     * @example
     * ```ts
     * await visitor.deleteFollowingAvatar();
     * ```
     *
     * @returns {Promise<void>} Returns nothing if successful.
     */
    deleteFollowingAvatar(): Promise<void>;
    /**
     * Retrieves all inventory items owned by this visitor and app's key.
     *
     * @keywords get, fetch, retrieve, list, inventory, items, visitor
     *
     * @example
     * ```ts
     * const items = await visitor.fetchInventoryItems();
     * ```
     *
     * @returns {Promise<void>} Returns an array of InventoryItem objects.
     */
    fetchInventoryItems(): Promise<void>;
    get inventoryItems(): UserInventoryItem[];
    /**
     * Grants an inventory item to this visitor.
     *
     * @param item The InventoryItem to modify.
     * @param quantity The new quantity to set.
     *
     * @example
     * ```ts
     * await visitor.grantInventoryItem("item-id-123", 2);
     * ```
     *
     * @returns {Promise<UserInventoryItem>} Returns the updated inventory or a response object.
     */
    grantInventoryItem(item: InventoryItem, quantity?: number): Promise<UserInventoryItem>;
    /**
     * Modifies the quantity of an inventory item in this visitor's inventory.
     *
     * @param item The UserInventoryItem to modify.
     * @param quantity The new quantity to set.
     *
     * @example
     * ```ts
     * await visitor.modifyInventoryItemQuantity("item-id-123", 5);
     * ```
     *
     * @returns {Promise<UserInventoryItem>} Returns the updated inventory or a response object.
     */
    modifyInventoryItemQuantity(item: UserInventoryItem, quantity: number): Promise<UserInventoryItem>;
}

type VisitorType = {
    visitorId: number;
    color: string;
    displayName: string;
    gestureType: number;
    hidden: boolean;
    isAdmin: boolean;
    isBackground: boolean;
    isMobile: boolean;
    isRecording: boolean;
    isRecordingBot: boolean;
    lastUpdate: number;
    moveFrom: object;
    movedOn: number;
    moveTo: {
        x: number;
        y: number;
    };
    muted: boolean;
    performer: boolean;
    performerNear: boolean;
    shareScreen: boolean;
    sitting: boolean;
    username: string;
};
type VisitorsToMoveType = {
    visitorObj: Visitor;
    shouldTeleportVisitor: boolean;
    x: number;
    y: number;
};
type VisitorsToMoveArrayType = Array<VisitorsToMoveType>;

declare enum WorldActivityType {
    GAME_ON = "GAME_ON",
    GAME_WAITING = "GAME_WAITING",
    GAME_HIGH_SCORE = "GAME_HIGH_SCORE"
}

interface SDKInterface {
    credentials?: InteractiveCredentials$1;
    jwt?: string;
    requestOptions: object;
    topia: Topia;
}

interface AssetInterface extends SDKInterface {
    fetchAssetById(): Promise<object | ResponseType>;
    updateAsset({ assetName, bottomLayerURL, creatorTags, isPublic, shouldUploadImages, tagJson, topLayerURL, }: {
        assetName: string;
        bottomLayerURL?: string;
        creatorTags: object;
        isPublic: boolean;
        shouldUploadImages?: boolean;
        tagJson: string;
        topLayerURL?: string;
    }): Promise<object | ResponseType>;
    addedOn?: string;
    assetName?: string;
    creatorTags?: object;
    readonly id?: string;
    isPublic?: boolean;
    library?: string;
    originalAssetId?: string;
    originalKit?: string;
    ownerId?: string;
    ownerName?: string;
    platformAsset?: boolean;
    purchased?: boolean;
    purchaseDate?: string;
    purchasedFrom?: string;
    specialType?: string | null;
    transactionId?: string;
    type?: string;
}
type AssetOptionalInterface = {
    attributes?: AssetInterface | object;
    credentials?: InteractiveCredentials$1;
};

interface DroppedAssetInterface extends AssetInterface {
    fetchDroppedAssetById(): Promise<void | ResponseType$1>;
    deleteDroppedAsset(): Promise<void | ResponseType$1>;
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    setDataObject(dataObject: object, options: object): Promise<void | ResponseType$1>;
    updateDataObject(dataObject: object, options: object): Promise<void | ResponseType$1>;
    incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType$1>;
    updateBroadcast({ assetBroadcast, assetBroadcastAll, broadcasterEmail, }: UpdateBroadcastInterface): Promise<void | ResponseType$1>;
    updateClickType({ clickType, clickableLink, clickableLinkTitle, clickableDisplayTextDescription, clickableDisplayTextHeadline, isForceLinkInIframe, isOpenLinkInDrawer, portalName, position, }: UpdateClickTypeInterface): Promise<void | ResponseType$1>;
    updateCustomTextAsset(style: object | undefined | null, text: string | null | undefined): Promise<void | ResponseType$1>;
    updateMediaType({ audioRadius, audioSliderVolume, isVideo, mediaLink, mediaName, mediaType, portalName, syncUserMedia, }: UpdateMediaTypeInterface): Promise<void | ResponseType$1>;
    updateMuteZone(isMutezone: boolean): Promise<void | ResponseType$1>;
    updateLandmarkZone({ isLandmarkZoneEnabled, landmarkZoneName, landmarkZoneIsVisible, }: {
        isLandmarkZoneEnabled: boolean;
        landmarkZoneName?: string;
        landmarkZoneIsVisible?: boolean;
    }): Promise<void | ResponseType$1>;
    updateWebhookZone(isWebhookZoneEnabled: boolean): Promise<void | ResponseType$1>;
    updatePosition(x: number, y: number, yOrderAdjust?: number): Promise<void | ResponseType$1>;
    updatePrivateZone({ isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap, }: UpdatePrivateZoneInterface): Promise<void | ResponseType$1>;
    updateScale(assetScale: number): Promise<void | ResponseType$1>;
    flip(): Promise<void | ResponseType$1>;
    updateUploadedMediaSelected(mediaId: string): Promise<void | ResponseType$1>;
    updateWebImageLayers(bottom: string, top: string): Promise<void | ResponseType$1>;
    addWebhook({ dataObject, description, isUniqueOnly, title, type, url, }: {
        dataObject: object;
        description: string;
        isUniqueOnly: boolean;
        title: string;
        type: string;
        url: string;
    }): Promise<void | AxiosResponse>;
    setInteractiveSettings({ isInteractive, interactivePublicKey, }: {
        isInteractive?: boolean;
        interactivePublicKey: string;
    }): Promise<void | ResponseType$1>;
    setClickableLinkMulti({ clickableLinks }: SetClickableLinkMultiInterface): Promise<void | ResponseType$1>;
    updateClickableLinkMulti({ clickableLink, clickableLinkTitle, isForceLinkInIframe, isOpenLinkInDrawer, existingLinkId, linkSamlQueryParams, }: UpdateClickableLinkMultiInterface): Promise<void | ResponseType$1>;
    removeClickableLink({ linkId }: RemoveClickableLinkInterface): Promise<void | ResponseType$1>;
    fetchDroppedAssetAnalytics({ periodType, dateValue, year, }: {
        periodType: "week" | "month" | "quarter" | "year";
        dateValue: number;
        year: number;
    }): Promise<void | ResponseType$1>;
    id?: string;
    assetId?: string;
    assetScale?: number | null;
    assetPodium?: boolean | null;
    audioRadius?: DroppedAssetMediaVolumeRadius | number | null;
    assetBroadcastAll?: boolean | null;
    assetPrivateConversation?: boolean | null;
    assetPrivateZoneChannelDisabled?: boolean | null;
    assetPrivateConversationCap?: number | null;
    audioSliderVolume?: number | null;
    bottomLayerURL?: string | null;
    broadcasterEmail?: string | null;
    clickableLinks?: Array<DroppedAssetClickType> | null;
    clickType?: string | null;
    clickableLink?: string | null;
    clickableLinkTitle?: string | null;
    clickablePortal?: string | null;
    creationDatetime?: number;
    contractAddress?: string | null;
    dataObject?: object | null;
    clickableDisplayTextDescription?: string | null;
    clickableDisplayTextHeadline?: string | null;
    existingKey?: string | null;
    interactivePublicKey?: string | null;
    isInteractive?: boolean | null;
    isLandmarkZoneEnabled?: boolean | null;
    isPrivateZone?: boolean | null;
    isVideoPlayer?: boolean | null;
    kitId?: string | null;
    layer0?: string | null;
    layer1?: string | null;
    mediaLink?: string | null;
    mediaPlayTime?: number | null;
    mediaType?: string | null;
    mediaName?: string | null;
    muteZone?: boolean | null;
    mediaUploadedId?: string | null;
    mediaUploadedLink?: string | null;
    metaName?: string | null;
    position: {
        x: number;
        y: number;
    };
    portalCoordsX?: number | null;
    portalCoordsY?: number | null;
    showMediaAsIfPeer?: boolean | null;
    syncUserMedia?: boolean | null;
    uniqueName?: string | null;
    urlSlug: string;
    tagJson?: string | null;
    text?: string | null;
    textColor?: string | null;
    textSize?: number | null;
    textWidth?: number | null;
    textWeight?: string | null;
    textFont?: string | null;
    textFontFamily?: string | null;
    teleportX?: number | null;
    teleportY?: number | null;
    topLayerURL?: string | null;
    tokenSymbol?: string | null;
    tokenName?: string | null;
    worldId?: string | null;
    walletAddress?: string | null;
    yOrderAdjust?: number | null;
}
interface DroppedAssetOptionalInterface {
    attributes?: DroppedAssetInterface | {
        position?: {
            x: number;
            y: number;
        };
        text?: string;
        urlSlug?: string;
    };
    credentials?: InteractiveCredentials$1 | object;
}
interface UpdateBroadcastInterface {
    assetBroadcast?: boolean;
    assetBroadcastAll?: boolean;
    broadcasterEmail?: string;
}
interface UpdateDroppedAssetInterface {
    assetScale?: number;
    audioRadius?: DroppedAssetMediaVolumeRadius | number;
    audioSliderVolume?: number;
    clickType?: DroppedAssetClickType;
    clickableLink?: string;
    clickableLinkTitle?: string;
    clickableDisplayTextDescription?: string;
    clickableDisplayTextHeadline?: string;
    flipped?: boolean;
    isInteractive?: boolean;
    isTextTopLayer?: boolean;
    isVideo?: boolean;
    interactivePublicKey?: string;
    layer0?: string;
    layer1?: string;
    mediaLink?: string;
    mediaName?: string;
    mediaType?: DroppedAssetMediaType;
    position?: {
        x: number;
        y: number;
    };
    portalName?: string;
    specialType?: string;
    syncUserMedia?: boolean;
    text?: string | null;
    textColor?: string | null;
    textSize?: number | null;
    textWidth?: number | null;
    textWeight?: string | null;
    uniqueName?: string;
    yOrderAdjust?: number;
}
interface UpdateClickTypeInterface {
    clickType?: DroppedAssetClickType;
    clickableLink?: string;
    clickableLinkTitle?: string;
    clickableDisplayTextDescription?: string;
    clickableDisplayTextHeadline?: string;
    isForceLinkInIframe?: boolean;
    isOpenLinkInDrawer?: boolean;
    portalName?: string;
    position?: {
        x: number;
        y: number;
    };
}
interface SetClickableLinkMultiInterface {
    clickableLinks: DroppedAssetLinkType[];
}
interface UpdateClickableLinkMultiInterface {
    clickableLink: string;
    clickableLinkTitle?: string;
    isForceLinkInIframe?: boolean;
    isOpenLinkInDrawer?: boolean;
    existingLinkId?: string;
    linkSamlQueryParams?: string;
}
interface RemoveClickableLinkInterface {
    linkId: string;
}
interface UpdateMediaTypeInterface {
    audioRadius: DroppedAssetMediaVolumeRadius | number;
    audioSliderVolume: number;
    isVideo: boolean;
    mediaLink: string;
    mediaName: string;
    mediaType: DroppedAssetMediaType;
    portalName: string;
    syncUserMedia: boolean;
}
interface UpdatePrivateZoneInterface {
    isPrivateZone: boolean;
    isPrivateZoneChatDisabled: boolean;
    privateZoneUserCap: number;
}

interface EcosystemInterface {
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType$1>;
    updateDataObject(dataObject: object, options: object): Promise<void | ResponseType$1>;
    incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType$1>;
}
interface EcosystemOptionalInterface {
    credentials?: InteractiveCredentials$1;
}

interface SceneInterface {
    fetchSceneById(): Promise<void | ResponseType$1>;
    id: string;
    background?: null;
    description?: string;
    created?: {
        _seconds?: number;
        _nanoseconds?: number;
    };
    height?: number;
    kitWorldOwner?: string;
    name?: string;
    price?: number;
    spawnPosition?: {
        radius?: number;
        y?: number;
        x?: number;
    };
    timesUsed?: number;
    urlSlug?: string;
    width?: number;
    worldCenteredAtZero?: boolean;
}
type SceneOptionalInterface = {
    attributes?: SceneInterface | object;
    credentials?: InteractiveCredentials$1;
};

interface FireToastInterface {
    groupId?: string;
    title: string;
    text?: string;
}

interface TopiaInterface {
    apiDomain?: string;
    apiKey?: string;
    apiProtocol?: string;
    axios: AxiosInstance;
    interactiveKey?: string;
    interactiveSecret?: jwt.Secret;
}

interface UserInterface {
    checkInteractiveCredentials(): Promise<void | ResponseType$1>;
    fetchAvatars(): Promise<void | ResponseType$1>;
    addAvatar(formData: FormData): Promise<void | ResponseType$1>;
    updateAvatar(avatarId: string, formData: FormData): Promise<void | ResponseType$1>;
    deleteAvatar(avatarId: string): Promise<void | ResponseType$1>;
    fetchAssets(): Promise<void | ResponseType$1>;
    fetchPlatformAssets(): Promise<object | ResponseType$1>;
    fetchScenes(): Promise<void | ResponseType$1>;
    fetchWorldsByKey(): Promise<void | ResponseType$1>;
    sendEmail({ html, subject, to }: {
        html: string;
        subject: string;
        to: string;
    }): Promise<object | ResponseType$1>;
    getExpressions({ name, getUnlockablesOnly }: {
        name?: string;
        getUnlockablesOnly?: boolean;
    }): Promise<ResponseType$1>;
    fetchDataObject(appPublicKey?: string, appJWT?: string): Promise<void | ResponseType$1>;
    setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType$1>;
    incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType$1>;
    fetchInventoryItems(): Promise<void>;
    inventoryItems: UserInventoryItem[];
    grantInventoryItem(item: InventoryItem, quantity: number): Promise<UserInventoryItem>;
    modifyInventoryItemQuantity(item: UserInventoryItem, quantity: number): Promise<UserInventoryItem>;
    dataObject?: object | null;
}
interface UserOptionalInterface {
    credentials?: InteractiveCredentials$1;
    profileId?: string | null;
    visitorId?: number | null;
    urlSlug?: string;
}

interface VisitorInterface extends SDKInterface {
    fetchVisitor(): Promise<void | ResponseType$1>;
    moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType$1>;
    fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType$1>;
    openIframe({ link, shouldOpenInDrawer, title }: OpenIframeInterface): Promise<void | ResponseType$1>;
    reloadIframe(droppedAssetId: string): Promise<void | ResponseType$1>;
    closeIframe(droppedAssetId: string): Promise<void | ResponseType$1>;
    turnAVOff(): Promise<void | ResponseType$1>;
    getExpressions({ name, getUnlockablesOnly }: {
        name?: string;
        getUnlockablesOnly?: boolean;
    }): Promise<ResponseType$1>;
    grantExpression({ id, name }: {
        id?: string;
        name?: string;
    }): Promise<ResponseType$1>;
    getAllParticles(): Promise<ResponseType$1>;
    fetchInventoryItems(): Promise<void>;
    inventoryItems: UserInventoryItem[];
    grantInventoryItem(item: InventoryItem, quantity: number): Promise<UserInventoryItem>;
    modifyInventoryItemQuantity(item: UserInventoryItem, quantity: number): Promise<UserInventoryItem>;
    fetchInventoryItem(item: InventoryItem): Promise<UserInventoryItem>;
    addFollowingAvatar(name: string, avatarImageUrl: string, height: number, width: number): Promise<Visitor>;
    deleteFollowingAvatar(): Promise<void>;
    getFollowingAvatar(): Promise<Visitor | null>;
    triggerParticle({ id, name, duration, }: {
        id?: string;
        name?: string;
        duration?: number;
    }): Promise<ResponseType$1 | string>;
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType$1>;
    updateDataObject(dataObject: object, options: object): Promise<void | ResponseType$1>;
    incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType$1>;
    updatePublicKeyAnalytics(analytics?: AnalyticType[]): Promise<void | ResponseType$1>;
    sendSignalToVisitor(signal: any): Promise<void | (ResponseType$1 & {
        answerSignal: any;
    })>;
    color?: string;
    dataObject?: object | null | undefined;
    displayName?: string;
    gestureType?: number;
    hidden?: boolean;
    isAdmin?: boolean;
    isBackground?: boolean;
    isMobile?: boolean;
    isRecording?: boolean;
    isRecordingBot?: boolean;
    landmarkZonesString?: string;
    lastUpdate?: number | undefined;
    moveFrom?: object;
    movedOn?: number | undefined;
    moveTo?: {
        x?: number;
        y?: number;
    };
    muted?: boolean;
    performer?: boolean;
    performerNear?: boolean;
    privateZoneId?: string;
    id?: number | undefined;
    shareScreen?: boolean;
    sitting?: boolean;
    urlSlug: string;
    username?: string | undefined;
}
interface VisitorOptionalInterface {
    attributes?: VisitorInterface | object;
    credentials?: InteractiveCredentials$1;
}
interface MoveVisitorInterface {
    shouldTeleportVisitor: boolean;
    x: number;
    y: number;
}
interface OpenIframeInterface {
    droppedAssetId: string;
    link: string;
    shouldOpenInDrawer?: boolean;
    title?: string;
}

interface WebhookInterface {
    webhookId?: string;
    assetId?: string;
    active: boolean;
    dataObject?: object;
    dateAdded: Date;
    description: string;
    isUniqueOnly: boolean;
    lastUpdated?: Date;
    title: string;
    type: string;
    url: string;
    urlSlug: string;
}

interface WebRTCConnectorInterface {
    getTwilioConfig(): Promise<void | ResponseType$1>;
}
interface WebRTCConnectorOptionalInterface {
    credentials?: InteractiveCredentials$1;
    twilioConfig?: object;
}

interface WorldActivityOptionalInterface {
    credentials?: InteractiveCredentials$1;
}
interface MoveAllVisitorsInterface {
    shouldFetchVisitors?: boolean;
    shouldTeleportVisitors?: boolean;
    scatterVisitorsBy?: number;
    x: number;
    y: number;
}

interface WorldDetailsInterface {
    background?: string | null;
    controls?: {
        allowMuteAll?: boolean;
        disableHideVideo?: boolean;
        isMobileDisabled?: boolean;
        isShowingCurrentGuests?: boolean;
    };
    created?: object;
    description?: string;
    enforceWhitelistOnLogin?: boolean;
    forceAuthOnLogin?: boolean;
    height?: number;
    heroImage?: string;
    mapExists?: boolean;
    name?: string;
    redirectTo?: string | null;
    spawnPosition?: {
        x?: number;
        y?: number;
    };
    tileBackgroundEverywhere?: boolean | null;
    urlSlug: string;
    useTopiaPassword?: boolean;
    width?: number;
}
interface WorldInterface extends SDKInterface, WorldDetailsInterface {
    fetchDetails(): Promise<void | ResponseType$1>;
    updateDetails({ controls, description, forceAuthOnLogin, height, name, spawnPosition, width, }: WorldDetailsInterface): Promise<void | ResponseType$1>;
    updateCloseWorldSettings({ closeWorldDescription, isWorldClosed, }: {
        closeWorldDescription: string;
        isWorldClosed: boolean;
    }): Promise<void | ResponseType$1>;
    fetchDroppedAssets(): Promise<void | ResponseType$1>;
    fetchDroppedAssetsWithUniqueName({ uniqueName, isPartial, isReversed, }: {
        uniqueName: string;
        isPartial?: boolean;
        isReversed?: boolean;
    }): Promise<DroppedAsset[]>;
    fetchDroppedAssetsBySceneDropId({ sceneDropId, uniqueName, }: {
        sceneDropId: string;
        uniqueName?: string;
    }): Promise<DroppedAsset[]>;
    updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object>;
    fetchLandmarkZones(landmarkZoneName?: string, sceneDropId?: string): Promise<DroppedAsset[]>;
    fetchSceneDropIds(): Promise<object | ResponseType$1>;
    fetchScenes(): Promise<object | ResponseType$1>;
    dropScene({ assetSuffix, position, sceneId, }: {
        assetSuffix: string;
        position: object;
        sceneId: string;
    }): Promise<object | ResponseType$1>;
    replaceScene(sceneId: string): Promise<void | ResponseType$1>;
    getAllParticles(): Promise<ResponseType$1>;
    triggerParticle({ id, name, duration, position, }: {
        id?: string;
        name?: string;
        duration?: number;
        position?: object;
    }): Promise<ResponseType$1 | string>;
    triggerActivity({ type, assetId, excludeFromNotification, }: {
        type: WorldActivityType;
        assetId: string;
        excludeFromNotification?: (string | number)[];
    }): Promise<ResponseType$1 | string>;
    fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType$1>;
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType$1>;
    updateDataObject(dataObject: object, options: object): Promise<void | ResponseType$1>;
    incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType$1>;
    fetchWebhooks(): Promise<void | ResponseType$1>;
    fetchWorldAnalytics({ periodType, dateValue, year, }: {
        periodType: "week" | "month" | "quarter" | "year";
        dateValue: number;
        year: number;
    }): Promise<void | ResponseType$1>;
    dataObject?: object | null;
}
interface WorldOptionalInterface {
    attributes?: WorldDetailsInterface | object;
    credentials?: InteractiveCredentials$1;
}
interface WorldWebhooksInterface {
    webhooks: Array<WebhookInterface>;
}

type InteractiveCredentials = {
    apiKey?: string;
    assetId?: string;
    interactiveNonce?: string;
    interactivePublicKey?: string;
    profileId?: string | null;
    urlSlug?: string;
    visitorId?: number;
    iframeId?: string;
    gameEngineId?: string;
};

/**
 * Interface for an inventory item.
 */
interface InventoryItemInterface extends SDKInterface {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    created_at?: Date;
    updated_at?: Date;
    metadata?: object | null;
    image_path?: string;
    interactive_key_id?: string;
    status?: string;
}
type InventoryItemOptionalInterface = {
    attributes?: InventoryItemInterface | object;
    credentials?: InteractiveCredentials;
};

/**
 * Interface for a user-owned inventory item.
 */
interface UserInventoryItemInterface extends InventoryItemInterface {
    userItemId: string;
    user_id: string;
    item_id: string;
    quantity: number;
    created_at?: Date;
    updated_at?: Date;
    metadata?: object | null;
    grant_source: string;
}
type UserInventoryItemOptionalInterface = {
    attributes?: UserInventoryItemInterface | object;
    credentials?: InteractiveCredentials;
};

/**
 * Create a single instance of Topia axios used for all calls to the public API in all classes
 *
 * @example
 * ```ts
 * const topia = await new Topia({
 *   apiDomain: "api.topia.io",
 *   apiKey: "exampleKey",
 *   interactiveKey: "key",
 *   interactiveSecret: "secret",
 * });
 * ```
 */
declare class Topia implements TopiaInterface {
    axios: AxiosInstance;
    apiDomain?: string;
    apiKey?: string;
    apiProtocol?: string;
    interactiveKey?: string;
    interactiveSecret?: jwt.Secret;
    mcAuthorizationKey?: string;
    constructor({ apiDomain, apiKey, apiProtocol, interactiveKey, interactiveSecret, mcAuthorizationKey, }: {
        apiDomain?: string;
        apiKey?: string;
        apiProtocol?: string;
        interactiveKey?: string;
        interactiveSecret?: jwt.Secret;
        mcAuthorizationKey?: string;
    });
}

/**
 * Create an instance of SDKController class with credentials.
 *
 * @example
 * ```ts
 * const credentials = {
 *   assetId: "exampleAsset",
 *   interactiveNonce: "exampleNonce"
 *   interactivePublicKey: "examplePublicKey",
 *   visitorId: 1,
 *   url: "https://topia.io",
 * }
 * const topia = await new Topia({
 *   apiDomain: "api.topia.io",
 *   apiKey: "exampleKey",
 *   interactiveKey: "key",
 *   interactiveSecret: "secret",
 * }
 * await new SDKController({ credentials, topia });
 * ```
 */
declare abstract class SDKController implements SDKInterface {
    credentials: InteractiveCredentials$1 | undefined;
    jwt?: string;
    requestOptions: object;
    topia: Topia;
    constructor(topia: Topia, credentials?: InteractiveCredentials$1);
    topiaPublicApi(): axios.AxiosInstance;
    errorHandler({ error, message, params, sdkMethod, }: {
        error?: Error | AxiosError | unknown;
        message?: string;
        params?: object;
        sdkMethod?: string;
    }): {
        data: {};
        message: string;
        method: string;
        params: object;
        sdkMethod: string | undefined;
        stack: string;
        stackTrace: Error;
        status: number;
        success: boolean;
        url: string;
    };
}

/**
 * Create an instance of Asset class with a given asset id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Asset } from "utils/topiaInit.ts";
 *
 * const asset = await Asset.create(assetId, {
 *   attributes: { assetName: "My Asset", isPublic: false },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class Asset extends SDKController implements AssetInterface {
    readonly id?: string;
    constructor(topia: Topia, id: string, options?: AssetOptionalInterface);
    /**
     * Retrieves platform asset details and assigns response data to the instance.
     *
     * @keywords get, fetch, retrieve, load, details, info, information
     *
     * @example
     * ```ts
     * await asset.fetchAssetById();
     * const { assetName } = asset;
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the asset details or an error response.
     */
    fetchAssetById(): Promise<object | ResponseType$1>;
    /**
     * Updates platform asset details.
     *
     * @keywords update, modify, change, edit, alter, transform
     *
     * @example
     * ```ts
     * await asset.updateAsset({
     *   assetName: "exampleAsset",
     *   bottomLayerURL: null,
     *   creatorTags: { "decorations": true },
     *   isPublic: true,
     *   shouldUploadImages: true,
     *   tagJson: "[{"label":"decorations","value":"decorations"}]",
     *   topLayerURL: "https://example.topLayerURL"
     *  });
     * const { assetName } = asset;
     * ```
     */
    updateAsset({ assetName, bottomLayerURL, creatorTags, isPublic, shouldUploadImages, tagJson, topLayerURL, }: {
        assetName: string;
        bottomLayerURL?: string;
        creatorTags: object;
        isPublic: boolean;
        shouldUploadImages?: boolean;
        tagJson: string;
        topLayerURL?: string;
    }): Promise<object | ResponseType$1>;
}

/**
 * Create an instance of Ecosystem class with optional session credentials
 *
 * @example
 * ```ts
 * import { Ecosystem } from "utils/topiaInit.ts";
 *
 * const ecosystem = await Ecosystem.create({
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class Ecosystem extends SDKController {
    #private;
    dataObject?: object | null | undefined;
    constructor(topia: Topia, options?: EcosystemOptionalInterface);
    /**
     * Retrieves the data object for a Topia ecosystem. Requires canUpdateEcosystemDataObjects permission to be set to true for the public key.
     *
     * @keywords get, fetch, retrieve, load, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * const dataObject = await ecosystem.fetchDataObject("exampleAppPublicKey", "exampleAppPublicKeyJWT");
     * ```
     *
     * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
     */
    fetchDataObject(appPublicKey?: string, appJWT?: string, sharedAppPublicKey?: string, sharedAppJWT?: string): Promise<void | ResponseType$1>;
    /**
     * Sets the data object for a Topia ecosystem.
     *
     * @remarks
     * This method also allows you to set a data object on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
     *
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords set, assign, store, save, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await ecosystem.setDataObject({ "exampleKey": "exampleValue" }, {
     *   sharedAppPublicKey: "exampleAppPublicKey",
     *   sharedAppJWT: "exampleAppPublicKeyJWT",}
     * });
     * const { exampleKey } = ecosystem.dataObject;
     * ```
     */
    setDataObject(dataObject: object | null | undefined, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Updates the data object for a Topia ecosystem.
     *
     * @remarks
     * This method also allows you to update a data object on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
     *
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords update, modify, change, edit, alter, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await ecosystem.updateDataObject({
     *    [`profiles.${profileId}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
     *    [`profileMapper.${profileId}`]: username,
     *  }, {
     *    sharedAppPublicKey: "exampleAppPublicKey",
     *    sharedAppJWT: "exampleAppPublicKeyJWT",
     *    analytics: [{ analyticName: "itemCollected", profileId, uniqueKey: profileId, urlSlug } ],
     *    lock: { lockId: `${assetId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
     *  }
     * });
     * const { exampleKey } = ecosystem.dataObject;
     * ```
     */
    updateDataObject(dataObject: object, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Increments a specific value in the data object for a Topia ecosystem by the amount specified. Must have valid interactive credentials from a visitor in the world.
     *
     * @remarks
     * This method also allows you to increment a data object value on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
     *
     * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
     *
     * @keywords increment, increase, add, count, data, object, state
     *
     * @category Data Objects
     *
     * @example
     * ```ts
     * await ecosystem.incrementDataObjectValue("key", 1, {
     *   sharedAppPublicKey: "exampleAppPublicKey",
     *   sharedAppJWT: "exampleAppPublicKeyJWT",}
     * });
     * ```
     */
    incrementDataObjectValue(path: string, amount: number, options?: {
        appPublicKey?: string;
        appJWT?: string;
        sharedAppPublicKey?: string;
        sharedAppJWT?: string;
        analytics?: AnalyticType[];
        lock?: {
            lockId: string;
            releaseLock?: boolean;
        };
    }): Promise<void | ResponseType$1>;
    /**
     * Retrieves all inventory items for a given keyholder (app public key).
     *
     * @keywords get, fetch, retrieve, list, inventory, items, keyholder
     *
     * @example
     * ```ts
     * const items = await ecosystem.fetchInventoryItems("appPublicKey", "appJWT");
     * ```
     *
     * @returns {Promise<object[]>} Returns an array of InventoryItem objects.
     */
    fetchInventoryItems(): Promise<void>;
    get inventoryItems(): InventoryItem[];
}

/**
 * Create an instance of WebRTCConnector class with optional session credentials.
 *
 * @example
 * ```ts
 * const webRTC = await new WebRTCConnector(topia, {
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", profileId: "exampleProfileId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class WebRTCConnector extends SDKController implements WebRTCConnectorInterface {
    twilioConfig?: object | null | undefined;
    urlSlug: string;
    constructor(topia: Topia, urlSlug: string, options?: WebRTCConnectorOptionalInterface);
    /**
     * Get twilio
     *
     * @example
     * ```ts
     * await webRTCConnector.getTwilioConfig();
     * ```
     */
    getTwilioConfig(): Promise<void | ResponseType$1>;
}

/**
 * Create an instance of WorldActivity class with a given url slug and optional attributes and session credentials.
 *
 * @remarks
 * This class is responsible for all activity of a specified world including editing dropped assets, moving current visitors, etc.
 *
 * @example
 * ```ts
 * import { WorldActivity } from "utils/topiaInit.ts";
 *
 * const activity = await WorldActivity.create(urlSlug, {
 *   attributes: { name: "Example World" },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
declare class WorldActivity extends SDKController {
    #private;
    urlSlug: string;
    constructor(topia: Topia, urlSlug: string, options?: WorldActivityOptionalInterface);
    get visitors(): {
        [key: string]: Visitor;
    };
    private fetchVisitors;
    /**
     * Retrieve all visitors currently in a world.
     *
     * @keywords get, fetch, retrieve, list, current, visitors, users, players
     *
     * @category Visitors
     *
     * @example
     * ```ts
     * const visitors = await worldActivity.currentVisitors("exampleLandmarkZoneId", true);
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the an object containing current visitors keyed by visitorId or an error.
     */
    currentVisitors(shouldIncludeAdminPermissions?: boolean): Promise<{
        [key: string]: Visitor;
    }>;
    /**
     * Retrieve all visitors currently in a Landmark Zone.
     *
     * @keywords get, fetch, retrieve, list, zone, area, landmark, visitors, users
     *
     * @category Visitors
     *
     * @example
     * ```ts
     * const visitors = await worldActivity.fetchVisitorsInZone({ droppedAssetId: "exampleDroppedAssetId" });
     * ```
     *
     * @returns {Promise<void | ResponseType>} Returns the an object containing current visitors keyed by visitorId or an error.
     */
    fetchVisitorsInZone({ droppedAssetId, shouldIncludeAdminPermissions, }: {
        droppedAssetId?: string;
        shouldIncludeAdminPermissions?: boolean;
    }): Promise<{
        [key: string]: Visitor;
    }>;
    /**
     * Move all visitors currently in a world to a single set of coordinates.
     *
     * @remarks
     * Optionally refetch visitors, teleport or walk visitors to new location,
     * and scatter visitors by any number so that they don't all move to the exact same location.
     *
     * @keywords move, teleport, position, coordinate, visitors, users, relocate
     *
     * @category Visitors
     *
     * @example
     * ```ts
     * await worldActivity.moveAllVisitors({
     *   shouldFetchVisitors: true,
     *   shouldTeleportVisitors: true,
     *   scatterVisitorsBy: 40,
     *   x: 100,
     *   y: 100,
     * });
     * ```
     *
     * @returns
     * Updates each Visitor instance and worldActivity.visitors map.
     */
    moveAllVisitors({ shouldFetchVisitors, shouldTeleportVisitors, scatterVisitorsBy, x, y, }: MoveAllVisitorsInterface): Promise<(void | ResponseType$1)[] | undefined>;
    /**
     * Teleport or walk a list of visitors currently in a world to various coordinates.
     *
     * @keywords move, teleport, position, coordinate, visitor, user, relocate
     *
     * @category Visitors
     *
     * @example
     * ```ts
     * const visitorsToMove = [
     *   {
     *     visitorObj: worldActivity.visitors["1"],
     *     shouldTeleportVisitor: true,
     *     x: 100,
     *     y: 100
     *   }, {
     *     visitorObj: worldActivity.visitors["2"],
     *     shouldTeleportVisitor: false,
     *     x: 100,
     *     y: 100
     *   }
     * ];
     * await worldActivity.moveVisitors(visitorsToMove);
     * ```
     *
     * @returns
     * Updates each Visitor instance and worldActivity.visitors map.
     */
    moveVisitors(visitorsToMove: VisitorsToMoveArrayType): Promise<(void | ResponseType$1)[]>;
}

/**
 * Factory for creating Asset instances. Use this factory to create or upload assets in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @keywords asset, factory, create, upload, instantiate, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, AssetFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Asset = new AssetFactory(topia);
 * ```
 */
declare class AssetFactory extends SDKController {
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of Asset class with the specified asset id.
     *
     * @remarks
     * This method creates a new Asset controller instance that can be used to interact with an existing asset.
     * It does not create a new asset in the database.
     *
     * @keywords create, instantiate, asset, initialize, get, instance
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Asset } from "utils/topiaInit.ts";
     *
     * // Create an Asset instance with credentials
     * const assetInstance = await Asset.create(assetId, {
     *   credentials: {
     *     interactiveNonce,
     *     interactivePublicKey,
     *     assetId,
     *     urlSlug,
     *     visitorId
     *   }
     * });
     *
     * // Use the instance to interact with the asset
     * await assetInstance.fetchAssetById();
     * ```
     *
     * @returns {Asset} Returns a new Asset object with the asset id.
     */
    create(id: string, options?: AssetOptionalInterface): Asset;
    /**
     * Upload a new Asset to the Topia platform and return a new instance of Asset class.
     *
     * @remarks
     * This method both creates a new asset in the database and returns an Asset controller instance.
     * A valid API key with appropriate permissions is required.
     *
     * @keywords upload, create, new, asset, add, store
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Asset } from "utils/topiaInit.ts";
     *
     * // Prepare the asset payload
     * const assetPayload = {
     *   assetName: "My Decorative Asset",
     *   bottomLayerURL: "https://example.com/bottom-layer.png",
     *   creatorTags: { "decorations": true },
     *   tagJson: "[{"label":"decorations","value":"decorations"}]",
     *   isPublic: true,
     *   topLayerURL: "https://example.com/top-layer.png"
     * };
     *
     * // Upload the asset using your API key
     * const asset = await Asset.upload(assetPayload, apiKey);
     *
     * // Access the new asset's properties
     * console.log(asset.id);
     * ```
     *
     * @returns {Asset} Returns a new Asset object with the asset details.
     */
    upload(assetPayload: AssetType, apiKey: string): Promise<Asset>;
}

/**
 * Factory for creating and retrieving DroppedAsset instances. Use this factory to work with assets that have been placed in a Topia world.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @keywords dropped asset, factory, create, get, retrieve, instantiate, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, DroppedAssetFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const DroppedAsset = new DroppedAssetFactory(topia);
 * ```
 */
declare class DroppedAssetFactory extends SDKController {
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of DroppedAsset class for an existing dropped asset in a world.
     *
     * @remarks
     * This method creates a controller instance for an existing dropped asset but does not fetch its properties.
     * Use this when you need a lightweight instance and will fetch properties separately if needed or when you already have the properties.
     *
     * @keywords create, instantiate, dropped asset, initialize, instance
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { DroppedAsset } from "utils/topiaInit.ts";
     *
     * // Create a DroppedAsset instance with credentials
     * const droppedAssetInstance = DroppedAsset.create(
     *   assetId,
     *   urlSlug,
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // Later fetch its properties if needed
     * await droppedAssetInstance.fetchDroppedAssetById();
     * ```
     *
     * @returns {DroppedAsset} Returns a new DroppedAsset object without fetching its properties.
     */
    create(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): DroppedAsset;
    /**
     * Instantiate a new instance of DroppedAsset class and automatically fetch all its properties.
     *
     * @remarks
     * This method creates a controller instance and immediately fetches all properties of the dropped asset.
     * It's a convenience method that combines creating an instance and calling fetchDroppedAssetById().
     *
     * @keywords get, fetch, retrieve, dropped asset, load, instance
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { DroppedAsset } from "utils/topiaInit.ts";
     *
     * // Get a fully populated DroppedAsset instance
     * const droppedAssetInstance = await DroppedAsset.get(
     *   assetId,
     *   urlSlug,
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // The properties are already loaded, so you can use them immediately
     * console.log(droppedAssetInstance.position);
     * ```
     *
     * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object with all properties already fetched.
     */
    get(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): Promise<DroppedAsset>;
    /**
     * Searches for and retrieves a dropped asset by its unique name within a world.
     *
     * @remarks
     * This method leverages the handleGetDroppedAssetByUniqueName endpoint in the Public API and assumes there is exactly one dropped asset with the matching uniqueName for the given urlSlug.
     * Use this when you need to find a dropped asset by its uniqueName rather than its id.
     *
     * @keywords find, search, unique name, retrieve, locate, lookup, dropped asset
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { DroppedAsset } from "utils/topiaInit.ts";
     *
     * // Find and retrieve a dropped asset by its unique name
     * const droppedAssetInstance = await DroppedAsset.getWithUniqueName(
     *   "banner-sign-northeast",
     *   "my-world-slug",
     *   "your-interactive-secret",
     *   {
     *     apiKey: "your-api-key",
     *     interactivePublicKey: "your-public-key",
     *     // other credentials...
     *   }
     * );
     *
     * // The properties are already loaded, so you can use them immediately
     * console.log(droppedAssetInstance.position);
     * ```
     *
     * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object with all properties already fetched.
     */
    getWithUniqueName(uniqueName: string, urlSlug: string, interactiveSecret: string, credentials: InteractiveCredentials$1): Promise<DroppedAsset>;
    /**
     * Drops an asset in a world and returns a new instance of DroppedAsset class with all properties.
     *
     * @remarks
     * This method places an existing Asset into a world at specified coordinates, effectively "dropping" it into the environment.
     * You can customize various properties of the dropped asset during placement, such as scale, position, interactive settings, and visual layers.
     *
     * @keywords drop, place, add, create, position, asset, deploy
     *
     * @example
     * ```ts
     * // Import the pre-initialized factories from your app's initialization file
     * import { Asset, DroppedAsset } from "utils/topiaInit.ts";
     *
     * // First get an asset instance
     * const assetInstance = Asset.create("asset-id-123", {
     *   credentials: {
     *     interactiveNonce,
     *     interactivePublicKey,
     *     assetId,
     *     urlSlug,
     *     visitorId
     *   }
     * });
     *
     * // Then drop (place) the asset in a world
     * const droppedAssetInstance = await DroppedAsset.drop(
     *   assetInstance,
     *   {
     *     // Basic positioning and appearance
     *     position: { x: 250, y: 350 },
     *     assetScale: 1.5,
     *     flipped: true,
     *     uniqueName: "welcome-sign",
     *     urlSlug: "my-world-slug",
     *
     *     // For web images (optional)
     *     layer0: "https://example.com/background.png",
     *     layer1: "https://example.com/foreground.png",
     *
     *     // For interactive assets (optional)
     *     interactivePublicKey: "your-public-key",
     *     isInteractive: true,
     *
     *     // For clickable assets (optional)
     *     clickType: "link",
     *     clickableLink: "https://example.com",
     *     clickableLinkTitle: "Visit Example"
     *   }
     * );
     *
     * // The dropped asset is ready to use
     * console.log(droppedAssetInstance.id);
     * ```
     *
     * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object representing the placed asset in the world.
     */
    drop(asset: Asset, { assetScale, clickType, clickableDisplayTextDescription, clickableDisplayTextHeadline, clickableLink, clickableLinkTitle, flipped, interactivePublicKey, isInteractive, isForceLinkInIframe, isOpenLinkInDrawer, isTextTopLayer, layer0, layer1, position: { x, y }, sceneDropId, text, textColor, textFontFamily, textSize, textWeight, textWidth, uniqueName, urlSlug, yOrderAdjust, }: {
        assetScale?: number;
        flipped?: boolean;
        clickType?: string;
        clickableDisplayTextDescription?: string;
        clickableDisplayTextHeadline?: string;
        clickableLink?: string;
        clickableLinkTitle?: string;
        interactivePublicKey?: string;
        isInteractive?: boolean;
        isForceLinkInIframe?: boolean;
        isOpenLinkInDrawer?: boolean;
        isTextTopLayer?: boolean;
        layer0?: string;
        layer1?: string;
        position: {
            x: number;
            y: number;
        };
        sceneDropId?: string;
        text?: string;
        textColor?: string;
        textFontFamily?: string;
        textSize?: number;
        textWeight?: string;
        textWidth?: number;
        uniqueName?: string;
        urlSlug: string;
        yOrderAdjust?: number;
    }): Promise<DroppedAsset>;
}

/**
 * Factory for creating Ecosystem instances. Use this factory to work with ecosystem-wide data and operations.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The Ecosystem controller provides methods to interact with data shared across multiple worlds.
 *
 * @keywords ecosystem, factory, create, multi-world, global, shared data, platform
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, EcosystemFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Ecosystem = new EcosystemFactory(topia);
 * ```
 */
declare class EcosystemFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of Ecosystem class for interacting with ecosystem-wide data.
     *
     * @remarks
     * This method creates a controller instance for accessing and managing data that spans multiple worlds.
     * Use this for cross-world data sharing, global data objects, and ecosystem-wide operations.
     *
     * @keywords create, instantiate, ecosystem, initialize, global, shared data, platform
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Ecosystem } from "utils/topiaInit.ts";
     *
     * // Create an Ecosystem instance with credentials
     * const ecosystemInstance = Ecosystem.create({
     *   credentials: {
     *     interactiveNonce,
     *     interactivePublicKey,
     *     assetId,
     *     urlSlug,
     *     visitorId
     *   }
     * });
     *
     * // Work with ecosystem-wide data objects
     * await ecosystemInstance.fetchDataObject("global-leaderboard");
     * await ecosystemInstance.setDataObject("global-leaderboard", { scores: [...] });
     * ```
     *
     * @returns {Ecosystem} Returns a new Ecosystem object for interacting with ecosystem-wide data.
     */
    create(options?: EcosystemOptionalInterface): Ecosystem;
}

/**
 * Factory for creating Scene instances. Use this factory to work with scenes in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * Scenes represent the template or blueprint for a world's design and layout.
 *
 * @keywords scene, factory, create, template, blueprint, layout, design
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, SceneFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Scene = new SceneFactory(topia);
 * ```
 */
declare class SceneFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of Scene class for an existing scene in the platform.
     *
     * @remarks
     * This method creates a controller instance for working with a scene but does not fetch its properties.
     * Use this when you need to interact with a specific scene by its id.
     *
     * @keywords create, instantiate, scene, initialize, instance, template
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Scene } from "utils/topiaInit.ts";
     *
     * // Create a Scene instance with credentials
     * const sceneInstance = Scene.create(
     *   "scene-id-123",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // Fetch scene details if needed
     * await sceneInstance.fetchSceneById();
     * ```
     *
     * @returns {Scene} Returns a new Scene object for interacting with the specified scene.
     */
    create(id: string, options?: SceneOptionalInterface): Scene;
    /**
     * Instantiate a new instance of Scene class and retrieve all properties.
     *
     * @example
     * ```
     * const sceneInstance = await Scene.get(id, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
     * ```
     *
     * @returns {Promise<Scene>} Returns a new Scene object with all properties.
     */
    get(id: string, options?: SceneOptionalInterface): Promise<Scene>;
}

/**
 * Factory for creating User instances. Use this factory to work with user data in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The User controller allows you to interact with user-specific information and operations.
 *
 * @keywords user, factory, create, account, profile, member, visitor
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, UserFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const User = new UserFactory(topia);
 * ```
 */
declare class UserFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of User class for working with user data.
     *
     * @remarks
     * This method creates a controller instance for interacting with user-specific operations.
     * The User controller doesn't require an id since it represents the currently authenticated user.
     *
     * @keywords create, instantiate, user, initialize, account, profile, member
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { User } from "utils/topiaInit.ts";
     *
     * // Create a User instance with credentials
     * const userInstance = User.create({
     *   credentials: {
     *     interactiveNonce,
     *     interactivePublicKey,
     *     assetId,
     *     urlSlug,
     *     visitorId
     *   }
     * });
     *
     * // Use methods on the user instance
     * await userInstance.checkInteractiveCredentials();
     * const avatars = await userInstance.fetchAvatars();
     * ```
     *
     * @returns {User} Returns a new User object for interacting with user data.
     */
    create(options?: UserOptionalInterface): User;
}

/**
 * Factory for creating Visitor instances. Use this factory to work with visitors in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The Visitor controller represents a specific visitor/avatar instance in a world.
 *
 * @keywords visitor, factory, create, get, avatar, user, participant
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, VisitorFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Visitor = new VisitorFactory(topia);
 * ```
 */
declare class VisitorFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of Visitor class for an existing visitor in a world.
     *
     * @remarks
     * This method creates a controller instance for a visitor but does not fetch its properties.
     * Use this when you need a lightweight instance and will fetch properties separately or when you already have the properties.
     *
     * @keywords create, instantiate, visitor, initialize, avatar, instance
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Visitor } from "utils/topiaInit.ts";
     *
     * // Create a Visitor instance with credentials
     * const visitorInstance = Visitor.create(
     *   12345, // visitor id
     *   "my-world-slug",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // Later fetch visitor properties if needed
     * await visitorInstance.fetchVisitor();
     * ```
     *
     * @returns {Visitor} Returns a new Visitor object without fetching its properties.
     */
    create(id: number, urlSlug: string, options?: VisitorOptionalInterface): Visitor;
    /**
     * Instantiate a new instance of Visitor class and automatically fetch all its properties.
     *
     * @remarks
     * This method creates a controller instance and immediately fetches all properties of the visitor.
     * It's a convenience method that combines creating an instance and calling fetchVisitor().
     *
     * @keywords get, fetch, retrieve, visitor, load, avatar, instance
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { Visitor } from "utils/topiaInit.ts";
     *
     * // Get a fully populated Visitor instance
     * const visitorInstance = await Visitor.get(
     *   12345, // visitor id
     *   "my-world-slug",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // The properties are already loaded, so you can use them immediately
     * console.log(visitorInstance.username);
     * console.log(visitorInstance.position);
     * ```
     *
     * @returns {Promise<Visitor>} Returns a new Visitor object with all properties already fetched.
     */
    get(id: number, urlSlug: string, options?: VisitorOptionalInterface): Promise<Visitor>;
}

/**
 * Factory for creating WebRTCConnector instances. Use this factory to establish WebRTC connections for audio/video in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The WebRTCConnector provides methods to set up and manage real-time audio/video communication.
 *
 * @keywords webrtc, factory, create, audio, video, communication, real-time, conference
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WebRTCConnectorFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const WebRTCConnector = new WebRTCConnectorFactory(topia);
 * ```
 */
declare class WebRTCConnectorFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of WebRTCConnector class for managing audio/video communication.
     *
     * @remarks
     * This method creates a controller instance for establishing and managing WebRTC connections.
     * Use this for implementing real-time audio/video communication features in Topia worlds.
     *
     * @keywords create, instantiate, webrtc, initialize, audio, video, communication, stream
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { WebRTCConnector } from "utils/topiaInit.ts";
     *
     * // Create a WebRTCConnector instance with credentials and configuration
     * const webRTCInstance = WebRTCConnector.create(
     *   "my-world-slug",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     },
     *     twilioConfig: {
     *       // Twilio configuration options
     *     }
     *   }
     * );
     *
     * // Use the instance to establish connections
     * await webRTCInstance.connect();
     * ```
     *
     * @returns {WebRTCConnector} Returns a new WebRTCConnector object for managing audio/video communication.
     */
    create(urlSlug: string, options?: WebRTCConnectorOptionalInterface): WebRTCConnector;
}

/**
 * Factory for creating WorldActivity instances. Use this factory to monitor and manage visitor activity in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The WorldActivity controller provides methods to interact with real-time visitor activities and movements.
 *
 * @keywords world activity, factory, create, visitors, movement, tracking, presence, real-time
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WorldActivityFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const WorldActivity = new WorldActivityFactory(topia);
 * ```
 */
declare class WorldActivityFactory {
    topia: Topia;
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of WorldActivity class for monitoring visitor activity in a specific world.
     *
     * @remarks
     * This method creates a controller instance for tracking and managing visitor activity in a world.
     * Use this to fetch current visitors, move visitors, or monitor specific zones within a world.
     *
     * @keywords create, instantiate, world activity, initialize, visitors, tracking, presence
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { WorldActivity } from "utils/topiaInit.ts";
     *
     * // Create a WorldActivity instance with credentials
     * const worldActivityInstance = WorldActivity.create(
     *   "my-world-slug",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // Get current visitors in the world
     * const visitors = await worldActivityInstance.currentVisitors();
     * console.log(`There are ${visitors.length} visitors in the world`);
     *
     * // Check visitors in a specific zone
     * const zoneVisitors = await worldActivityInstance.fetchVisitorsInZone("stage-area");
     * ```
     *
     * @returns {WorldActivity} Returns a new WorldActivity object for tracking and managing visitor activity.
     */
    create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity;
}

/**
 * Factory for creating World instances. Use this factory to interact with Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The World controller provides methods to manage world settings, retrieve world details, and perform world-level operations.
 *
 * @keywords world, factory, create, virtual space, environment, room, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WorldFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const World = new WorldFactory(topia);
 * ```
 */
declare class WorldFactory extends SDKController {
    constructor(topia: Topia);
    /**
     * Instantiate a new instance of World class for interacting with a specific Topia world.
     *
     * @remarks
     * This method creates a controller instance for a world identified by its URL slug.
     * The world controller can be used to fetch details, update world settings, and perform other world-level operations.
     *
     * @keywords create, instantiate, world, initialize, virtual space, environment, room
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { World } from "utils/topiaInit.ts";
     *
     * // Create a World instance with credentials
     * const worldInstance = World.create(
     *   "my-world-slug",
     *   {
     *     credentials: {
     *       interactiveNonce,
     *       interactivePublicKey,
     *       assetId,
     *       urlSlug,
     *       visitorId
     *     }
     *   }
     * );
     *
     * // Fetch world details
     * await worldInstance.fetchDetails();
     * console.log(worldInstance.name);
     * ```
     *
     * @returns {World} Returns a new World object for interacting with the specified world.
     */
    create(urlSlug: string, options?: WorldOptionalInterface): World;
    /**
     * Deletes multiple dropped assets from a world in a single operation.
     *
     * @remarks
     * This method provides a convenient way to delete multiple dropped assets at once rather than
     * deleting them one by one. Requires appropriate permissions via interactive credentials.
     *
     * @keywords delete, remove, dropped assets, multiple, batch, cleanup, world
     *
     * @example
     * ```ts
     * // Import the pre-initialized factory from your app's initialization file
     * import { World } from "utils/topiaInit.ts";
     *
     * // Delete multiple dropped assets from a world
     * const result = await World.deleteDroppedAssets(
     *   "my-world-slug",
     *   ["asset-id-123", "asset-id-456", "asset-id-789"],
     *   "your-interactive-secret",
     *   {
     *     apiKey: "your-api-key",
     *     interactivePublicKey: "your-public-key",
     *     visitorId: 12345
     *   }
     * );
     *
     * if (result.success) {
     *   console.log("Assets successfully deleted");
     * }
     * ```
     *
     * @returns {Promise<{ success: boolean }>} Returns `{ success: true }` if all assets were deleted successfully.
     */
    deleteDroppedAssets(urlSlug: string, droppedAssetIds: string[], interactiveSecret: string, credentials: {
        apiKey?: string;
        interactiveNonce?: string;
        interactivePublicKey: string;
        visitorId?: number;
    }): Promise<{
        success: boolean;
    }>;
}

export { AnalyticType, AnimationMetaType, Asset, AssetFactory, AssetInterface, AssetOptionalInterface, AssetOptions, AssetType, DroppedAsset, DroppedAssetClickType, DroppedAssetFactory, DroppedAssetInterface, DroppedAssetLinkType, DroppedAssetMediaType, DroppedAssetMediaVolumeRadius, DroppedAssetOptionalInterface, DroppedAssetOptions, Ecosystem, EcosystemFactory, EcosystemInterface, EcosystemOptionalInterface, FireToastInterface, FrameType, InteractiveCredentials$1 as InteractiveCredentials, InventoryItemInterface, InventoryItemOptionalInterface, MoveAllVisitorsInterface, MoveVisitorInterface, OpenIframeInterface, RemoveClickableLinkInterface, ResponseType$1 as ResponseType, SDKController, SDKInterface, Scene, SceneFactory, SceneInterface, SceneOptionalInterface, SetClickableLinkMultiInterface, Topia, TopiaInterface, UpdateBroadcastInterface, UpdateClickTypeInterface, UpdateClickableLinkMultiInterface, UpdateDroppedAssetInterface, UpdateMediaTypeInterface, UpdatePrivateZoneInterface, User, UserFactory, UserInterface, UserInventoryItemInterface, UserInventoryItemOptionalInterface, UserOptionalInterface, UserOptions, Visitor, VisitorFactory, VisitorInterface, VisitorOptionalInterface, VisitorOptions, VisitorType, VisitorsToMoveArrayType, VisitorsToMoveType, WebRTCConnector, WebRTCConnectorFactory, WebRTCConnectorInterface, WebRTCConnectorOptionalInterface, WebhookInterface, World, WorldActivity, WorldActivityFactory, WorldActivityOptionalInterface, WorldActivityType, WorldDetailsInterface, WorldFactory, WorldInterface, WorldOptionalInterface, WorldOptions, WorldWebhooksInterface };
