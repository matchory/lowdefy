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

import errorHandler from './errorHandler';
import runCommand from './runCommand';
import startUp from './startUp';

jest.mock('./errorHandler');
jest.mock('./startUp');

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

beforeEach(() => {
  errorHandler.mockReset();
});

const options = { option: true };
const command = {
  command: true,
};

test('runCommand with synchronous function', async () => {
  const fn = jest.fn(() => 1 + 1);
  const wrapped = runCommand(fn);
  const res = await wrapped(options, command);
  expect(res).toBe(2);
  expect(fn).toHaveBeenCalled();
});

test('runCommand with asynchronous function', async () => {
  const fn = jest.fn(async () => {
    await wait(3);
    return 4;
  });
  const wrapped = runCommand(fn);
  const res = await wrapped(options, command);
  expect(res).toBe(4);
  expect(fn).toHaveBeenCalled();
});

test('runCommand calls startUp', async () => {
  const fn = jest.fn((...args) => args);
  const wrapped = runCommand(fn);
  const res = await wrapped(options, command);
  expect(res).toMatchInlineSnapshot(`
    Array [
      Object {
        "context": Object {
          "appId": "appId",
          "baseDirectory": "baseDirectory",
          "cacheDirectory": "baseDirectory/cacheDirectory",
          "cliConfig": Object {},
          "cliVersion": "cliVersion",
          "command": "test",
          "commandLineOptions": Object {
            "option": true,
          },
          "lowdefyVersion": "lowdefyVersion",
          "options": Object {
            "option": true,
          },
          "outputDirectory": "baseDirectory/outputDirectory",
          "print": Object {
            "info": [MockFunction],
            "log": [MockFunction],
            "succeed": [MockFunction],
          },
          "sendTelemetry": [MockFunction],
        },
      },
    ]
  `);
  expect(startUp.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "command": Object {
            "command": true,
          },
          "context": Object {
            "appId": "appId",
            "baseDirectory": "baseDirectory",
            "cacheDirectory": "baseDirectory/cacheDirectory",
            "cliConfig": Object {},
            "cliVersion": "cliVersion",
            "command": "test",
            "commandLineOptions": Object {
              "option": true,
            },
            "lowdefyVersion": "lowdefyVersion",
            "options": Object {
              "option": true,
            },
            "outputDirectory": "baseDirectory/outputDirectory",
            "print": Object {
              "info": [MockFunction],
              "log": [MockFunction],
              "succeed": [MockFunction],
            },
            "sendTelemetry": [MockFunction],
          },
          "options": Object {
            "option": true,
          },
        },
      ],
    ]
  `);
});

test('Catch error synchronous function', async () => {
  const fn = jest.fn(() => {
    throw new Error('Error');
  });
  const wrapped = runCommand(fn);
  await wrapped(options, command);
  expect(fn).toHaveBeenCalled();
  expect(errorHandler.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "context": Object {
            "appId": "appId",
            "baseDirectory": "baseDirectory",
            "cacheDirectory": "baseDirectory/cacheDirectory",
            "cliConfig": Object {},
            "cliVersion": "cliVersion",
            "command": "test",
            "commandLineOptions": Object {
              "option": true,
            },
            "lowdefyVersion": "lowdefyVersion",
            "options": Object {
              "option": true,
            },
            "outputDirectory": "baseDirectory/outputDirectory",
            "print": Object {
              "info": [MockFunction],
              "log": [MockFunction],
              "succeed": [MockFunction],
            },
            "sendTelemetry": [MockFunction],
          },
          "error": [Error: Error],
        },
      ],
    ]
  `);
});

test('Catch error asynchronous function', async () => {
  const fn = jest.fn(async () => {
    await wait(3);
    throw new Error('Async Error');
  });
  const wrapped = runCommand(fn);
  await wrapped(options, command);
  expect(fn).toHaveBeenCalled();
  expect(errorHandler.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "context": Object {
            "appId": "appId",
            "baseDirectory": "baseDirectory",
            "cacheDirectory": "baseDirectory/cacheDirectory",
            "cliConfig": Object {},
            "cliVersion": "cliVersion",
            "command": "test",
            "commandLineOptions": Object {
              "option": true,
            },
            "lowdefyVersion": "lowdefyVersion",
            "options": Object {
              "option": true,
            },
            "outputDirectory": "baseDirectory/outputDirectory",
            "print": Object {
              "info": [MockFunction],
              "log": [MockFunction],
              "succeed": [MockFunction],
            },
            "sendTelemetry": [MockFunction],
          },
          "error": [Error: Async Error],
        },
      ],
    ]
  `);
});
