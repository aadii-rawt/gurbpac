import React, { Suspense } from 'react'

const SuspenseWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Suspense
            fallback={
                <div className="flex h-full items-center justify-center bg-[#090a0c] text-white">
                    Loading...
                </div>
            }
        >
            {children}
        </Suspense>
    )
}

export default SuspenseWrapper