export const toEntries = (obj) =>
    Object.keys(obj).map((key) => [key, obj[key]]);

export const fromEntries = (props) =>
    props.reduce(
        (memo, [key, value]) => ({ ...memo, ...{ [key]: value } }),
        {}
    );
