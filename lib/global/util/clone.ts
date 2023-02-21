export default function copyInstance(original: any) {
    var copied = Object.assign(
        Object.create(
            Object.getPrototypeOf(original)
        ),
        original
    );
    return copied;
}