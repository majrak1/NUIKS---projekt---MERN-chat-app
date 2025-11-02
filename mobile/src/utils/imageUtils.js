/**
 * Converts SVG image URLs to PNG format for React Native compatibility
 * React Native Image component doesn't support SVG format
 */
export const convertImageUrl = (url) => {
    if (!url) return url;

    // console.log('ursdfsdfsdfsl', url);
    // If it's a dicebear SVG URL, convert it to PNG
    if (url.includes('api.dicebear.com') && url.includes('.svg')) {
        console.log('asfasfafsafa');
        return url.replace('.svg', '.png');
    }

    return url;
};

