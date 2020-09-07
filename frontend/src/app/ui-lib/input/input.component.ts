import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "ui-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: "number" | "text" | "password";
  @Input() formControlName?: string;
  @Input() label?: string;
  @Input() disabled: boolean = false;

  constructor() {}

  private _value: string | number;

  public get value(): string | number {
    return this._value;
  }
  public set value(v: string | number) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  onChange = (_) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  increment() {
    this.value = <number>this.value + 1;
  }
  decrement() {
    this.value = <number>this.value - 1;
  }
}
