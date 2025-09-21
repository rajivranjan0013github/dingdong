import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StatusBar, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
 import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
 import Animated, { useAnimatedStyle, useSharedValue, runOnJS, withTiming } from 'react-native-reanimated';
import PhotoManipulator from 'react-native-photo-manipulator';
import { useDispatch } from 'react-redux';
import { uploadDoubtImage } from '../redux/slices/topicSlice';

const AskDoubtEdit = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { path, source } = route.params || {};

    const uri = useMemo(() => {
        if (!path) return null;
        // Handle content:// URIs from the gallery and file:// URIs from other sources
        if (path.startsWith('file://') || path.startsWith('content://')) {
            return path;
        }
        return `file://${path}`;
    }, [path]);

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const PREVIEW_SIDE_PADDING = 35; // match camera preview padding
    const PREVIEW_ASPECT_W = 3;
    const PREVIEW_ASPECT_H = 4;
    const CONTAINER_WIDTH = screenWidth - PREVIEW_SIDE_PADDING;
    const CONTAINER_HEIGHT = (CONTAINER_WIDTH * PREVIEW_ASPECT_H) / PREVIEW_ASPECT_W;

    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [displayedImage, setDisplayedImage] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [resultUri, setResultUri] = useState(null);

    const cropX = useSharedValue(0);
    const cropY = useSharedValue(0);
    const cropW = useSharedValue(0);
    const cropH = useSharedValue(0);

    const opacity = useSharedValue(0);

    const hasInitializedCrop = useRef(false);

    // Load intrinsic image size once per uri
    useEffect(() => {
        if (!uri) return;
        Image.getSize(
            uri,
            (width, height) => {
                setImgSize({ width, height });
                opacity.value = withTiming(1);
            },
            (error) => {
                console.error("Failed to get image size:", error);
            }
        );
    }, [uri]);

    // Recompute displayed image rect and preserve crop on layout/orientation changes
    useEffect(() => {
        const { width: originalW, height: originalH } = imgSize;
        if (!originalW || !originalH) return;

        const containScale = Math.min(CONTAINER_WIDTH / originalW, CONTAINER_HEIGHT / originalH);
        const dWidth = originalW * containScale;
        const dHeight = originalH * containScale;
        const dx = (CONTAINER_WIDTH - dWidth) / 2;
        const dy = (CONTAINER_HEIGHT - dHeight) / 2;

        const prevDisplayed = displayedImage;
        setDisplayedImage({ width: dWidth, height: dHeight, x: dx, y: dy });

        const leftBound = Math.max(0, dx);
        const rightBound = Math.min(CONTAINER_WIDTH, dx + dWidth);
        const topBound = Math.max(0, dy);
        const bottomBound = Math.min(CONTAINER_HEIGHT, dy + dHeight);

        if (!hasInitializedCrop.current || !prevDisplayed.width || !prevDisplayed.height) {
            cropX.value = dx;
            cropY.value = dy;
            cropW.value = dWidth;
            cropH.value = dHeight;
            hasInitializedCrop.current = true;
            return;
        }

        // Preserve current crop selection proportionally relative to previous displayed image rect
        const prevNormX = (cropX.value - prevDisplayed.x) / prevDisplayed.width;
        const prevNormY = (cropY.value - prevDisplayed.y) / prevDisplayed.height;
        const prevNormW = cropW.value / prevDisplayed.width;
        const prevNormH = cropH.value / prevDisplayed.height;

        let nextX = dx + prevNormX * dWidth;
        let nextY = dy + prevNormY * dHeight;
        let nextW = prevNormW * dWidth;
        let nextH = prevNormH * dHeight;

        const minSize = 40;
        nextX = Math.max(leftBound, Math.min(nextX, rightBound - minSize));
        nextY = Math.max(topBound, Math.min(nextY, bottomBound - minSize));
        nextW = Math.max(minSize, Math.min(nextW, rightBound - nextX));
        nextH = Math.max(minSize, Math.min(nextH, bottomBound - nextY));

        cropX.value = nextX;
        cropY.value = nextY;
        cropW.value = nextW;
        cropH.value = nextH;
    }, [imgSize, CONTAINER_WIDTH, CONTAINER_HEIGHT]);


    const onCrop = useCallback(async () => {
        try {
            if (!uri) return;

            const { width: originalW, height: originalH } = imgSize;
            if (!originalW || !displayedImage.width || !displayedImage.height) return;

            const scaleX = originalW / displayedImage.width;
            const scaleY = originalH / displayedImage.height;

            // Map crop box from displayed coordinates → original image coordinates
            let x = (cropX.value - displayedImage.x) * scaleX;
            let y = (cropY.value - displayedImage.y) * scaleY;
            let width = cropW.value * scaleX;
            let height = cropH.value * scaleY;

            // Clamp to original image bounds
            x = Math.max(0, Math.min(x, Math.max(0, originalW - 1)));
            y = Math.max(0, Math.min(y, Math.max(0, originalH - 1)));
            width = Math.max(1, Math.min(width, originalW - x));
            height = Math.max(1, Math.min(height, originalH - y));

            // Round for image processors: floor origin, ceil size to cover selection
            const cropRegion = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.ceil(width),
                height: Math.ceil(height),
            };

            const croppedUri = await PhotoManipulator.crop(uri, cropRegion);
            console.log("uri", uri)
            console.log('croppedUri', croppedUri)
            const normalizedUri = croppedUri.startsWith('file://') ? croppedUri : `file://${croppedUri}`;

            const formData = new FormData();
            formData.append('file', {
                uri: normalizedUri,
                type: 'image/jpeg',
                name: 'doubt.jpg',
            });

            // Debug: show cropped image preview in-place and skip upload/navigation
            setResultUri(normalizedUri);

        } catch (e) {
            console.error("Cropping failed:", e);
        }
    }, [uri, imgSize, displayedImage, cropX, cropY, cropW, cropH, navigation, dispatch]);

    // Add reset functionality
   

    const context = useSharedValue({ x: 0, y: 0, w: 0, h: 0 });

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: cropX.value, y: cropY.value, w: cropW.value, h: cropH.value };
        })
        .onUpdate((e) => {
            let nextX = context.value.x + e.translationX;
            let nextY = context.value.y + e.translationY;

            // Clamp to visible bounds: intersection of container and displayed image
            const visLeft = Math.max(0, displayedImage.x);
            const visTop = Math.max(0, displayedImage.y);
            const visRight = Math.min(CONTAINER_WIDTH, displayedImage.x + displayedImage.width);
            const visBottom = Math.min(CONTAINER_HEIGHT, displayedImage.y + displayedImage.height);

            nextX = Math.max(visLeft, Math.min(nextX, visRight - cropW.value));
            nextY = Math.max(visTop, Math.min(nextY, visBottom - cropH.value));

            cropX.value = nextX;
            cropY.value = nextY;
        });

    const createCornerGesture = (corner) => {
        return Gesture.Pan()
            .hitSlop(24)
            .minDistance(0)
            .onStart(() => {
                context.value = { x: cropX.value, y: cropY.value, w: cropW.value, h: cropH.value };
            })
            .onUpdate((e) => {
                'worklet';
                const { x, y, w, h } = context.value;
                const minSize = 40;

                const dx = e.translationX;
                const dy = e.translationY;

                let newX = x;
                let newY = y;
                let newW = w;
                let newH = h;

                // Horizontal adjustments
                if (corner.includes('left')) {
                    const clampedDx = Math.min(Math.max(dx, -x + displayedImage.x), w - minSize);
                    newX = x + clampedDx;
                    newW = w - clampedDx;
                } else if (corner.includes('right')) {
                    const clampedDx = Math.min(Math.max(dx, minSize - w), displayedImage.x + displayedImage.width - (x + w));
                    newW = w + clampedDx;
                }

                // Vertical adjustments
                if (corner.includes('top')) {
                    const clampedDy = Math.min(Math.max(dy, -y + displayedImage.y), h - minSize);
                    newY = y + clampedDy;
                    newH = h - clampedDy;
                } else if (corner.includes('bottom')) {
                    const clampedDy = Math.min(Math.max(dy, minSize - h), displayedImage.y + displayedImage.height - (y + h));
                    newH = h + clampedDy;
                }
                
                // Clamp to visible bounds (handles landscape cover overflow)
                const leftBound = Math.max(0, displayedImage.x);
                const rightBound = Math.min(CONTAINER_WIDTH, displayedImage.x + displayedImage.width);
                const topBound = Math.max(0, displayedImage.y);
                const bottomBound = Math.min(CONTAINER_HEIGHT, displayedImage.y + displayedImage.height);

                newX = Math.max(leftBound, Math.min(newX, rightBound - minSize));
                newY = Math.max(topBound, Math.min(newY, bottomBound - minSize));
                newW = Math.max(minSize, Math.min(newW, rightBound - newX));
                newH = Math.max(minSize, Math.min(newH, bottomBound - newY));

                cropX.value = newX;
                cropY.value = newY;
                cropW.value = newW;
                cropH.value = newH;
            });
    };

    const createEdgeGesture = (edge) => {
        return Gesture.Pan()
            .hitSlop(18)
            .minDistance(0)
            .onStart(() => {
                context.value = { x: cropX.value, y: cropY.value, w: cropW.value, h: cropH.value };
            })
            .onUpdate((e) => {
                'worklet';
                const { x, y, w, h } = context.value;
                const minSize = 40;

                const dx = e.translationX;
                const dy = e.translationY;

                let newX = x;
                let newY = y;
                let newW = w;
                let newH = h;

                if (edge === 'left') {
                    const clampedDx = Math.min(Math.max(dx, -x + displayedImage.x), w - minSize);
                    newX = x + clampedDx;
                    newW = w - clampedDx;
                } else if (edge === 'right') {
                    const clampedDx = Math.min(Math.max(dx, minSize - w), displayedImage.x + displayedImage.width - (x + w));
                    newW = w + clampedDx;
                } else if (edge === 'top') {
                    const clampedDy = Math.min(Math.max(dy, -y + displayedImage.y), h - minSize);
                    newY = y + clampedDy;
                    newH = h - clampedDy;
                } else if (edge === 'bottom') {
                    const clampedDy = Math.min(Math.max(dy, minSize - h), displayedImage.y + displayedImage.height - (y + h));
                    newH = h + clampedDy;
                }

                // Clamp to visible bounds (handles landscape cover overflow)
                const leftBound = Math.max(0, displayedImage.x);
                const rightBound = Math.min(CONTAINER_WIDTH, displayedImage.x + displayedImage.width);
                const topBound = Math.max(0, displayedImage.y);
                const bottomBound = Math.min(CONTAINER_HEIGHT, displayedImage.y + displayedImage.height);

                newX = Math.max(leftBound, Math.min(newX, rightBound - minSize));
                newY = Math.max(topBound, Math.min(newY, bottomBound - minSize));
                newW = Math.max(minSize, Math.min(newW, rightBound - newX));
                newH = Math.max(minSize, Math.min(newH, bottomBound - newY));

                cropX.value = newX;
                cropY.value = newY;
                cropW.value = newW;
                cropH.value = newH;
            });
    };

    const animatedCropBoxStyle = useAnimatedStyle(() => ({
        top: cropY.value,
        left: cropX.value,
        width: cropW.value,
        height: cropH.value,
    }));

    const animatedClippedImageStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        top: displayedImage.y - cropY.value,
        left: displayedImage.x - cropX.value,
        width: displayedImage.width,
        height: displayedImage.height,
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.previewWrapper]}>
                    <View style={[styles.imageContainer, { width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }]}>
                        {resultUri ? (
                            <Image
                                source={{ uri: resultUri }}
                                style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
                                resizeMode={'contain'}
                            />
                        ) : (
                            <Animated.View style={{ flex: 1, opacity }}>
                                <Image
                                    source={{ uri }}
                                    style={{ width: displayedImage.width, height: displayedImage.height, top: displayedImage.y, left: displayedImage.x, opacity: 0.3 }}
                                    resizeMode={'contain'}
                                />

                                <Animated.View style={[styles.cropBox, animatedCropBoxStyle, { overflow: 'hidden' }]}>
                                    <Animated.Image
                                        source={{ uri }}
                                        style={animatedClippedImageStyle}
                                        resizeMode={'contain'}
                                    />
                                </Animated.View>
                                
                                <GestureDetector gesture={dragGesture}>
                                    <Animated.View style={[styles.cropBox, animatedCropBoxStyle]}>
                                        {/* Grid lines */}
                                        <View style={styles.gridRow} />
                                        <View style={styles.gridCol} />
                                        {/* Remove extra grid lines for simplicity, keep only crosshairs */}
                                        <View style={[styles.gridRow, { top: '50%' }]} />
                                        <View style={[styles.gridCol, { left: '50%' }]} />
                                        
                                        {/* Revert to simple L-shaped corner handles */}
                                        <GestureDetector gesture={Gesture.Simultaneous(createCornerGesture('top-left'), dragGesture)}><View style={[styles.corner, styles.topLeft, { zIndex: 3 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createCornerGesture('top-right'), dragGesture)}><View style={[styles.corner, styles.topRight, { zIndex: 3 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createCornerGesture('bottom-left'), dragGesture)}><View style={[styles.corner, styles.bottomLeft, { zIndex: 3 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createCornerGesture('bottom-right'), dragGesture)}><View style={[styles.corner, styles.bottomRight, { zIndex: 3 }]} /></GestureDetector>

                                        {/* Edge Handles for easier finger resizing */}
                                        <GestureDetector gesture={Gesture.Simultaneous(createEdgeGesture('top'), dragGesture)}><View style={[styles.edgeHandle, styles.edgeTop, { zIndex: 2 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createEdgeGesture('bottom'), dragGesture)}><View style={[styles.edgeHandle, styles.edgeBottom, { zIndex: 2 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createEdgeGesture('left'), dragGesture)}><View style={[styles.edgeHandle, styles.edgeLeft, { zIndex: 2 }]} /></GestureDetector>
                                        <GestureDetector gesture={Gesture.Simultaneous(createEdgeGesture('right'), dragGesture)}><View style={[styles.edgeHandle, styles.edgeRight, { zIndex: 2 }]} /></GestureDetector>
                                    </Animated.View>
                                </GestureDetector>
                            </Animated.View>
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                   
                    {resultUri ? (
                        <TouchableOpacity onPress={() => setResultUri(null)} style={styles.cropButton}>
                            <Text style={styles.cropButtonText}>Re-Crop</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={onCrop} style={styles.cropButton}>
                            <Text style={styles.cropButtonText}>As Doubt</Text>
                        </TouchableOpacity>
                    )}
                    {!resultUri && (
                        <Text style={styles.instructions}>Drag area to move • Drag corners/edges to resize</Text>
                    )}
                </View>
            </View>
        </GestureHandlerRootView>
    );
};
// const AskDoubtEdit = () => {
//     return (
//         <View>
//             <Text>Ask Doubt Edit</Text>
//         </View>
//     );
// };

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    previewWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { position: 'absolute', top: 50, left: 16, zIndex: 10 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
    imageContainer: { overflow: 'hidden',  backgroundColor: '#000' },
    cropBox: { position: 'absolute', borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    // gridRow: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
    // gridCol: { position: 'absolute', height: '100%', width: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
    corner: { position: 'absolute', width: 24, height: 24, borderColor: '#fff' },
    // Update styles to simple L-shaped corners without background or extra borders, and adjust positioning to prevent double border look
    topLeft: { top: 0, left: 0, width: 32, height: 32, borderTopWidth: 3, borderLeftWidth: 3 },
    topRight: { top: 0, right: 0, width: 32, height: 32, borderTopWidth: 3, borderRightWidth: 3 },
    bottomLeft: { bottom: 0, left: 0, width: 32, height: 32, borderBottomWidth: 3, borderLeftWidth: 3 },
    bottomRight: { bottom: 0, right: 0, width: 32, height: 32, borderBottomWidth: 3, borderRightWidth: 3 },
    edgeHandle: { position: 'absolute', backgroundColor: 'transparent' },
    edgeTop: { top: -12, left: 24, right: 24, height: 24 },
    edgeBottom: { bottom: -12, left: 24, right: 24, height: 24 },
    edgeLeft: { left: -12, top: 24, bottom: 24, width: 24 },
    edgeRight: { right: -12, top: 24, bottom: 24, width: 24 },
    // Remove edgeHandle styles
    footer: { alignItems: 'center', padding: 24 },
    cropButton: { backgroundColor: '#3b82f6', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999, marginBottom: 16 },
    cropButtonText: { color: 'white', fontWeight: '600', fontSize: 18 },
    instructions: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 12 },
});

export default AskDoubtEdit;