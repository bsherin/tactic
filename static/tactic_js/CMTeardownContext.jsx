import React, {createContext, useCallback, useEffect, useMemo, useRef} from 'react';

export {CMTeardownContext, CMTeardownProvider};

const CMTeardownContext = createContext();

function CMTeardownProvider({children, managerRef}) {
        const destroyFuncsRef = useRef([]);

        const runAllTeardowns = useCallback((id) => {
            for (const entry of destroyFuncsRef.current) {
                if (id === entry.id) {
                    entry.fn();
                }
            }
            destroyFuncsRef.current = destroyFuncsRef.current.filter(entry => entry.id !== id);
        }, []);

        const register = useCallback((id, fn) => {
            destroyFuncsRef.current.push({id, fn});
        }, []);

        // Expose teardown runner to parent
        useEffect(() => {
            if (managerRef) {
                managerRef.current = {runAllTeardowns};
            }
            return () => {
                if (managerRef) {
                    managerRef.current = null;
                }
            };
        }, [managerRef, runAllTeardowns]);

        const contextValue = useMemo(() => ({register}), [register]);

        return (
            <CMTeardownContext.Provider value={contextValue}>
                {children}
            </CMTeardownContext.Provider>
        );
    }