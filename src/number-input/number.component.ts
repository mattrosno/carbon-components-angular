import { Component, Input, HostBinding, EventEmitter, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { isNullOrUndefined } from "util";

/**
 * Used to emit changes performed on number input components.
 * @export
 * @class NumberChange
 */
export class NumberChange {
	/**
	 * Contains the `Number` that has been changed.
	 * @type {Number}
	 * @memberof NumberChange
	 */
	source: Number;
	/**
	 * The value of the `Number` field encompassed in the `NumberChange` class.
	 * @type {number}
	 * @memberof NumberChange
	 */
	value: number;
}

/**
 * @export
 * @class Number
 * @implements {ControlValueAccessor}
 */
@Component({
	selector: "ibm-number",
	template: `
		<div
			data-numberinput
			class="bx--number"
			[ngClass]="{
				'bx--number--light': theme === 'light',
				'bx--number--nolabel': !label,
				'bx--number--helpertext': helperText
			}">
			<label *ngIf="label" [for]="id" class="bx--label">{{label}}</label>
			<input
				type="number"
				[id]="id"
				[value]="value"
				[min]="min"
				[max]="max"
				[disabled]="disabled"
				[required]="required"/>
			<div class="bx--number__controls">
				<button
					class="bx--number__control-btn up-icon"
					(click)="onIncrement()">
					<svg width="10" height="5" viewBox="0 0 10 5">
						<path d="M0 5L5 .002 10 5z" fill-rule="evenodd" />
					</svg>
				</button>
				<button
					class="bx--number__control-btn down-icon"
					(click)="onDecrement()">
					<svg width="10" height="5" viewBox="0 0 10 5">
						<path d="M0 0l5 4.998L10 0z" fill-rule="evenodd" />
					</svg>
				</button>
			</div>
			<div *ngIf="helperText" class="bx--form__helper-text">{{helperText}}</div>
		</div>
	`,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: Number,
			multi: true
		}
	]
})
export class Number implements ControlValueAccessor {
	/**
	 * Variable used for creating unique ids for number input components.
	 */
	static numberCount = 0;

	@HostBinding("class.bx--form-item") containerClass = true;

	/**
	 * `light` or `dark` number input theme.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * Set to `true` for a disabled number input.
	 */
	@Input() disabled = false;
	/**
	 * The unique id for the number component.
	 */
	@Input() id = `number-${Number.numberCount}`;
	/**
	 * Reflects the required attribute of the `input` element.
	 */
	@Input() required: boolean;
	/**
	 * Sets the value attribute on the `input` element.
	 */
	@Input() value = 0;
	/**
	 * Sets the min attribute on the `input` element.
	 */
	@Input() min;
	/**
	 * Sets the max attribute on the `input` element.
	 */
	@Input() max;
	/**
	 * Sets the text inside the `label` tag.
	 */
	@Input() label;
	/**
	 * Sets the optional helper text.
	 */
	@Input() helperText;
	/**
	 * Emits event notifying other classes when a change in state occurs in the input.
	 */
	@Output() change = new EventEmitter<NumberChange>();

	/**
	 * Creates an instance of `Number`.
	 * @memberof Number
	 */
	constructor() {
		Number.numberCount++;
	}

	/**
	 * This is the initial value set to the component
	 * @param value The input value.
	 */
	public writeValue(value: any) {
		this.value = value;
	}

	/**
	 * Sets a method in order to propagate changes back to the form.
	 * @param {any} fn
	 * @memberof Number
	 */
	public registerOnChange(fn: any) {
		this.propagateChange = fn;
	}

	/**
	 * Registers a callback to be triggered when the control has been touched.
	 * @param fn Callback to be triggered when the number input is touched.
	 */
	public registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	/**
	 * Called when number input is blurred. Needed to properly implement `ControlValueAccessor`.
	 * @memberof Number
	 */
	onTouched: () => any = () => {};

	/**
	 * Method set in `registerOnChange` to propagate changes back to the form.
	 * @memberof Number
	 */
	propagateChange = (_: any) => {};

	/**
	 * Adds 1 to the current `value`.
	 */
	onIncrement(): void {
		if (isNullOrUndefined(this.max) || this.value < this.max) {
			this.value++;
			this.emitChangeEvent();
		}
	}

	/**
	 * Subtracts 1 to the current `value`.
	 */
	onDecrement(): void {
		if (isNullOrUndefined(this.min) || this.value > this.min) {
			this.value--;
			this.emitChangeEvent();
		}
	}

	/**
	 * Creates a class of `NumberChange` to emit the change in the `Number`.
	 */
	emitChangeEvent(): void {
		let event = new NumberChange();
		event.source = this;
		event.value = this.value;
		this.change.emit(event);
		this.propagateChange(this.value);
	}

}
