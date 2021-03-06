/*exported SelectionHandler */

(function(exports) {
'use strict';

const REQUIRED_KEYS = [
  // elements
  'container',
  'checkUncheckAllButton',
  // methods
  'checkInputs',
  'getAllInputs',
  'isInEditMode'
];

var SelectionHandler = function constructor(options) {
  // Set the necessary properties and method for selection module and throw
  // error if not existed in options.
  if (typeof options !== 'object') {
    throw new Error('options should be a valid object');
  }

  REQUIRED_KEYS.forEach((key) => {
    if (options[key] === undefined) {
      throw new Error('Selection options does not provide required key ' + key);
    }

    this[key] = options[key];
  });

  this.selected = new Set();

  this.container.addEventListener(
    'click', this.onSelected.bind(this)
  );
  this.checkUncheckAllButton.addEventListener(
    'click', this.toggleCheckedAll.bind(this)
  );
};

SelectionHandler.prototype = {
  get selectedCount() {
    return this.selected.size;
  },

  get selectedList() {
    return Array.from(this.selected);
  },

  onSelected: function sel_onSelected(event) {
    if (!this.isInEditMode()) {
      return;
    }
    var target = event.target;
    var value = target.value;
    var existed = this.selected.has(value);

    if (target.checked && !existed) {
      this.selected.add(value);
    } else if (!target.checked && existed) {
      this.selected.delete(value);
    } else {
      // Don't emit event if no selection change
      return;
    }

    this.checkInputs();
  },

  select: function sel_select(id) {
    this.selected.add('' + id);
  },

  unselect: function sel_unselect(id) {
    this.selected.delete('' + id);
  },

  // Update check status of input elements in the container
  updateCheckboxes: function sel_updateCheckboxes() {
    var inputs = this.container.querySelectorAll('input[type=checkbox]');
    var length = inputs.length;

    for (var i = 0; i < length; i++) {
      inputs[i].checked = this.selected.has(inputs[i].value);
    }
  },

  // if no message or few are checked : select all the messages
  // and if all messages are checked : deselect them all.
  toggleCheckedAll: function sel_toggleCheckedAll() {
    var selected = this.selected.size;
    var allInputs = this.getAllInputs();
    var allSelected = (selected === allInputs.length);

    if (allSelected) {
      this.selected.clear();
    } else {
      Array.prototype.forEach.call(allInputs, (data) => {
        this.selected.add(data.value);
      });
    }

    this.updateCheckboxes();

    this.checkInputs();
  },

  cleanForm: function sel_cleanForm() {
    // Reset all inputs
    this.selected.clear();

    this.updateCheckboxes();

    // Reset vars for deleting methods
    this.checkInputs();
  }
};

exports.SelectionHandler = SelectionHandler;

}(this));
