import * as React from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {AppStateType} from "../App";

interface FormSetupProps {
    onSubmit?: (data: any) => void;
    formData: AppStateType;
}

const keypressSets = [
    {
        key: '-',
        value: '',
    },
    {
        key: '1',
        value: '1',
    },
    {
        key: '2',
        value: '2',
    },
    {
        key: '3',
        value: '3',
    },
    {
        key: '4',
        value: '4',
    },
    {
        key: '5',
        value: '5',
    },
    {
        key: '6',
        value: '6',
    },
    {
        key: '7',
        value: '7',
    },
    {
        key: '8',
        value: '8',
    },
    {
        key: '9',
        value: '9',
    },
    {
        key: '0',
        value: '0',
    }
]
export const inputClassName = "block w-full p-2  h-8 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
export const labelClassName = "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
export const FormSetup: React.FC<FormSetupProps> = (props) => {
    const {control, register, handleSubmit} = useForm({
        defaultValues: props.formData,
    });
    const {fields, append, prepend, remove, swap, move, insert} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "presets", // unique name for your Field Array
    });
    const onSubmit = data => console.log(data);
    const handleAdd = () => {
        append({
            keypress: '',
            duration: 300,
            castingDuration: 0,
        })
    }
    const handleRemove = (index) => {
        remove(index)
    }
    const handleClickSubmit = () => {
        handleSubmit(props.onSubmit)();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-1">
                {fields.map((field, index) => {
                    const isFirst = index === 0;
                    return (
                        <div className="flex gap-2">
                            <div className="form-control w-full max-w-xs">
                                {
                                    isFirst && (
                                        <label className="label">
                                            <span className="label-text text-xs">Key</span>
                                        </label>
                                    )
                                }
                                <select
                                    className="select select-bordered select-xs w-full max-w-xs" {...register(`presets.${index}.keypress`)}>
                                    {keypressSets.map((keypressSet) => (
                                        <option value={keypressSet.value}>{keypressSet.key}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control w-full max-w-xs">
                                {
                                    isFirst && (
                                        <label className="label">
                                            <span className="label-text text-xs">Duration (ms)</span>
                                        </label>
                                    )
                                }
                                <input type="number"
                                       key={field.id} // important to include key with field's id
                                       {...register(`presets.${index}.duration`)}
                                       className="input input-bordered input-xs w-full max-w-xs"/>
                            </div>
                            <div className="form-control w-full max-w-xs">
                                {
                                    isFirst && (
                                        <label className="label">
                                            <span className="label-text text-xs">Cast Time (ms)</span>
                                        </label>
                                    )
                                }
                                <input type="number"
                                       key={field.id} // important to include key with field's id
                                       {...register(`presets.${index}.castingDuration`)}
                                       className="input input-bordered input-xs w-full max-w-xs"/>
                            </div>
                            <div className="form-control text-center">
                                {
                                    isFirst && (
                                        <label className="label">
                                            <span className="label-text">..</span>
                                        </label>
                                    )
                                }
                                <button className="btn btn-circle btn-xs btn-neutral"
                                        onClick={() => handleRemove(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
                <div className="my-1 w-full">
                    <button className="btn btn-xs w-full" onClick={handleAdd}>add</button>
                    <button className="btn btn-xs w-full btn-primary mt-1" onClick={handleClickSubmit}>save</button>
                </div>
            </div>
        </form>
    );
}