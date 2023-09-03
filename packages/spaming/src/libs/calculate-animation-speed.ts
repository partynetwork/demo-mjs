export const calculateAnimationSpeed = (castingSpeed: number) => {
    const castingAnimationSpeed = 1400 - castingSpeed * 5;
    return castingAnimationSpeed > 400 ? castingAnimationSpeed : 400;
}