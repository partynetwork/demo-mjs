import * as React from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {ProfileType} from "../App";
import {useEffect} from "react";

interface FormSetupProps {
    onSubmit?: (data: any) => void;
    formData: ProfileType;
}

const keypressSets = [
    {
        key: '-',
        value: '',
    },
    ...Array.from(Array(10)).map((_, index) => ({
        key: `${index}`,
        value: `${index}`,
    })),
    ...Array.from(Array(10)).map((_, index) => ({
        key: `ALT+${index}`,
        value: `alt_${index}`,
    })),
    ...Array.from(Array(10)).map((_, index) => ({
        key: `CTRL+${index}`,
        value: `ctrl_${index}`,
    })),
]
export const FormSetup: React.FC<FormSetupProps> = (props) => {
    const {reset, control, register, handleSubmit} = useForm({
        defaultValues: props.formData,
    });
    useEffect(() => {
        reset(props.formData);
    }, [props.formData.id]);
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
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text text-xs">Profile Name</span>
                </label>
                <input type="text"
                       {...register(`name`)}
                       className="input input-bordered input-xs w-full max-w-xs"/>
            </div>
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
                                    {keypressSets.map((keypressSet, i) => (
                                        <option key={i} value={keypressSet.value}>{keypressSet.key}</option>
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
                                <button className="btn btn-square btn-xs btn-error"
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
                    <button className="btn btn-xs w-full" onClick={handleAdd}>add key</button>
                    <button className="btn btn-xs w-full btn-primary mt-1" onClick={handleClickSubmit}>save</button>
                </div>
            </div>
        </form>
    );
}