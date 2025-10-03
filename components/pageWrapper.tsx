import ErrorFallback from "@/components/errorFallback";
import Spinner from "@/components/spinner";
import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";


export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const [retryKey, setRetryKey] = useState(0);

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                setRetryKey((k) => k + 1);
            }}
        >
            <Suspense fallback={<Spinner />} key={retryKey}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}