/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React from 'react';
import { type } from '@lowdefy/helpers';
import { blockDefaultProps } from '@lowdefy/block-tools';
import { Input } from 'antd';
import Label from '../Label/Label';
import useRunAfterUpdate from '../../useRunAfterUpdate';

const TextAreaComp = Input.TextArea;

const TextAreaBlock = ({
  blockId,
  events,
  loading,
  properties,
  required,
  validation,
  value,
  methods,
}) => {
  return (
    <Label
      blockId={blockId}
      events={events}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      validation={validation}
      required={required}
      loading={loading}
      methods={methods}
      content={{
        content: () => {
          const runAfterUpdate = useRunAfterUpdate();
          return (
            <TextAreaComp
              id={`${blockId}_input`}
              className={methods.makeCssClass(properties.inputStyle)}
              disabled={properties.disabled}
              autoFocus={properties.autoFocus}
              onChange={(event) => {
                methods.setValue(event.target.value);
                methods.triggerEvent({ name: 'onChange' });
                const cStart = event.target.selectionStart;
                const cEnd = event.target.selectionEnd;
                runAfterUpdate(() => {
                  event.target.setSelectionRange(cStart, cEnd);
                });
              }}
              onPressEnter={() => {
                methods.triggerEvent({ name: 'onPressEnter' });
              }}
              placeholder={properties.placeholder}
              value={value}
              allowClear={properties.allowClear}
              autoSize={
                properties.rows
                  ? { minRows: properties.rows, maxRows: properties.rows }
                  : type.isNone(properties.autoSize)
                  ? { minRows: 3 }
                  : properties.autoSize
              }
            />
          );
        },
      }}
    />
  );
};

TextAreaBlock.defaultProps = blockDefaultProps;

export default TextAreaBlock;
