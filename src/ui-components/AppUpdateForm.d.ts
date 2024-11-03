/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { GridProps, SwitchFieldProps } from '@aws-amplify/ui-react';
export declare type EscapeHatchProps = {
  [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
  [key: string]: string;
};
export declare type Variant = {
  variantValues: VariantValues;
  overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse,
) => ValidationResponse | Promise<ValidationResponse>;
export declare type AppUpdateFormInputValues = {
  status?: boolean;
};
export declare type AppUpdateFormValidationValues = {
  status?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> &
  React.DOMAttributes<HTMLDivElement>;
export declare type AppUpdateFormOverridesProps = {
  AppUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
  status?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type AppUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: AppUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    app?: any;
    onSubmit?: (fields: AppUpdateFormInputValues) => AppUpdateFormInputValues;
    onSuccess?: (fields: AppUpdateFormInputValues) => void;
    onError?: (fields: AppUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AppUpdateFormInputValues) => AppUpdateFormInputValues;
    onValidate?: AppUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function AppUpdateForm(
  props: AppUpdateFormProps,
): React.ReactElement;
