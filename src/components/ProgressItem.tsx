import React from "react";

const ProgressItem = React.memo(({
    label,
    value,
}: {
    label: string;
    value: number;
}) => {
    return (
        <div>
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-200">
                {value}
            </p>
        </div>
    );
}
)
export default ProgressItem