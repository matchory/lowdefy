/*
  Copyright 2020 Lowdefy, Inc

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

import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { blockDefaultProps } from '@lowdefy/block-tools';
import Icon from '../Icon/Icon';

const ConfirmModal = ({ blockId, content, methods, onCancel, onOk, properties }) => {
  useEffect(() => {
    methods.registerMethod('open', (args = {}) => {
      const additionalProps = {};
      if (properties.icon) {
        additionalProps.icon = (
          <Icon blockId={`${blockId}_icon`} properties={properties.icon} methods={methods} />
        );
      }
      Modal[args.status || properties.status || 'confirm']({
        id: `${blockId}_confirm_modal`,
        title: properties.title,
        content: (content.content && content.content()) || properties.content,
        className: methods.makeCssClass(properties.modalStyle),
        okText: properties.okText || 'Ok',
        okButtonProps: properties.okButton,
        cancelButtonProps: properties.cancelButton,
        cancelText: properties.cancelText || 'Cancel',
        centered: properties.centered || false,
        mask: properties.mask !== undefined ? properties.mask : true,
        maskClosable: properties.maskClosable || false,
        width: properties.width,
        zIndex: properties.zIndex,
        onOk: onOk || (() => methods.callAction({ action: 'onOk' })),
        onCancel: onCancel || (() => methods.callAction({ action: 'onCancel' })),
        ...additionalProps,
      });
    });
  }, [methods.registerMethod]);
  return <div id={blockId} />;
};

ConfirmModal.defaultProps = blockDefaultProps;

export default ConfirmModal;
