import { StructuedErrorTypes, stuctureErrorIfNotStructuredYet } from "../errors/error_factory";
import { logger } from "./logger";

export type WrapOptions = {
    dont_trow_if_error?: boolean,
    error_return_value?: any,
    hide_result?: boolean,
    hide_error?: boolean,
    start_log_addition?: string
}

export type WrapProps = {
    name: string,
    options?: WrapOptions,
    error_structure?: StructuedErrorTypes
}

export const wrapSync = < Z extends(...args: any[]) => any , X = ReturnType < Z > > (props: WrapProps, fn: ()=> X): X=> {
    try {
        logger.info(`${props.name} - start ${ props.options?.start_log_addition ? props.options.start_log_addition: '' }`)
        const result = fn()
        logger.info(`${props.name} - end ${ props.options?.hide_result ? '': result }`)
        return result
    } catch (error) {
        return hanle_error(props, error)
    }
};

export const wrap = async <Z extends (...args: any[]) => Promise<any>, X = ReturnType < Z > > (props: WrapProps, fn: ()=> X): Promise<X> => {
    try {
        logger.info(`${props.name} - start ${ props.options?.start_log_addition ? props.options.start_log_addition: '' }`)
        const result = await fn()
        logger.info(`${props.name} - end ${ props.options?.hide_result ? '': result }`)
        return result as X
    } catch (error) {
        return hanle_error(props, error)
    }
};

const hanle_error = (props: WrapProps, error: unknown) => {
    logger.error(`${props.name} - error ${ props.options?.hide_error ? '' : error }`)
    if (props.options?.dont_trow_if_error) {
        return dontThrow(props);
    } else {
        error = stuctureErrorIfNotStructuredYet(error, props.error_structure)
        throw error
    }
}

function dontThrow(props: WrapProps) {
    const error_return_value = props.options?.error_return_value ? props.options.error_return_value : null;
    return error_return_value;
}

