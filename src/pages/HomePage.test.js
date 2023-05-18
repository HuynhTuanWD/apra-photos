import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import HomePage, { PHOTOS_QUERY } from './HomePage';
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

const mocks = [
  {
    request: {
      query: PHOTOS_QUERY,
      variables: {
        page: 1,
        limit: 10,
      },
    },
    result: {
      data: {
        photos: [
          { id: '1', title: 'aaa', thumbnailUrl: 'aaa' },
          { id: '2', title: 'bbb', thumbnailUrl: 'bbb' },
          { id: '3', title: 'ccc', thumbnailUrl: 'ccc' },
        ],
      },
    },
  },
  {
    request: {
      query: PHOTOS_QUERY,
      variables: {
        page: 1,
        limit: 10,
        q: 'abc',
      },
    },
    result: {
      data: {
        photos: [
          { id: '1', title: 'aaa', thumbnailUrl: 'aaa' },
          { id: '2', title: 'bbb', thumbnailUrl: 'bbb' },
          { id: '3', title: 'ccc', thumbnailUrl: 'ccc' },
        ],
      },
    },
  },
];

it('renders without error', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <HomePage />
    </MockedProvider>,
  );
});
