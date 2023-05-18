import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pagination, PaginationProps, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { gql, useLazyQuery } from '@apollo/client';
import { TPhoto } from '../types/model';
import Search from 'antd/lib/input/Search';
import debounce from 'lodash/debounce';
import './homepage.scss';

export const PHOTOS_QUERY = gql`
  query ($page: Int, $limit: Int, $q: String) {
    photos(
      options: { paginate: { page: $page, limit: $limit }, search: { q: $q } }
    ) {
      data {
        id
        title
        thumbnailUrl
      }
      meta {
        totalCount
      }
    }
  }
`;

const HomePage: React.FC = () => {
  const [getPhotos, { data, loading, error }] = useLazyQuery<{
    photos: {
      data: TPhoto[];
      meta: {
        totalCount: number;
      };
    };
  }>(PHOTOS_QUERY, {
    variables: {
      page: 1,
      limit: 10,
    },
  });

  // params for fetch pagination and search key
  const [photoParams, setPhotoParams] = useState({
    page: 1,
    limit: 10,
  });
  const [searchKey, setSearchKey] = useState('');

  // show photo
  const [showPhotoUrl, setShowPhotoUrl] = useState(null);

  const columns: ColumnsType<TPhoto> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      render: (thumbnail) => (
        <img
          className="photos-thumbnail"
          src={thumbnail}
          width={30}
          height={30}
          onClick={() => setShowPhotoUrl(thumbnail)}
        />
      ),
    },
  ];

  // fetch first load photos
  useEffect(() => {
    getPhotos();
  }, []);

  const fetchPhotos = (page: number, limit: number, searchKey: string) => {
    if (searchKey == '') {
      getPhotos({
        variables: {
          page: page,
          limit: limit,
        },
      });
    } else {
      getPhotos({
        variables: {
          page: page,
          limit: limit,
          q: searchKey,
        },
      });
    }
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    page,
    pageSize,
  ) => {
    fetchPhotos(page, pageSize, searchKey);
    setPhotoParams({
      page: page,
      limit: pageSize,
    });
  };

  const onChangePage: PaginationProps['onChange'] = (page, pageSize) => {
    fetchPhotos(page, pageSize, searchKey);
    setPhotoParams({
      page: page,
      limit: pageSize,
    });
  };

  const searchPhotosByKeyDebounce = useRef(
    debounce((q: string) => {
      fetchPhotos(1, 10, q);
      setPhotoParams({
        page: 1,
        limit: 10,
      });
    }, 500),
  ).current;

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
    searchPhotosByKeyDebounce(event.target.value);
  };

  const onCancelShowPhotoModal = () => {
    setShowPhotoUrl(null);
  };

  if (error) return <div>Error!</div>;

  return (
    <div className="home-page">
      <div className="container">
        <div className="box-search-photos">
          <Search
            placeholder="Search photos"
            enterButton
            width={200}
            onChange={onChangeSearch}
          />
        </div>
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data?.photos.data}
          loading={loading}
          pagination={false}
        />
        <Pagination
          current={photoParams.page}
          total={data?.photos.meta.totalCount}
          onShowSizeChange={onShowSizeChange}
          onChange={onChangePage}
          className="photos-pagination"
        />
        <Modal
          centered
          open={!!showPhotoUrl}
          // onOk={handleOk}
          onCancel={onCancelShowPhotoModal}
          footer={null}
          className="show-photo-modal"
        >
          {showPhotoUrl ? <img src={showPhotoUrl} /> : null}
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;
