import React, { useEffect, useState, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import Loading from 'components/SplashScreen';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import operate from 'logic/operate';
import { numberWithCommas, round } from 'utilities/Number';
import { getBillHistory } from 'services';

import './style.scss';

const PAGE_SIZE = 15;

const History = () => {
    const [listBill, setListBill] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchBillHistory(page);
    }, []);

    const fetchBillHistory = async (currentPage) => {
        try {
            const params = {
                page: currentPage,
                size: PAGE_SIZE,
            };
            const res = await getBillHistory(params);
            const { bills, totalPages } = res.data;
            setHasMore(currentPage + 1 < totalPages);
            setListBill((prevState) => {
                const newListBill = [...prevState, ...bills];
                const uniqueListBill = Array.from(
                    new Set(newListBill.map((bill) => bill.date)),
                ).map((date) => {
                    return newListBill.find((bill) => bill.date === date);
                });

                return uniqueListBill;
            });
            setLoading(false);
            setPage(currentPage);
        } catch (error) {
            toast.error('Có lỗi xảy ra, hãy thử lại sau');
        }
    };

    const scrollParentRef = useRef(null);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="history open-screen">
            <div className="infinite-scroller" ref={scrollParentRef}>
                {listBill.length > 0 ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => fetchBillHistory(page + 1)}
                        hasMore={hasMore}
                        loader={<div className="spinner" key={0}></div>}
                        useWindow={false}
                        getScrollParent={() => scrollParentRef.current}
                        threshold={50}
                    >
                        {listBill.map((bill) => (
                            <Detail key={bill.date} data={bill} />
                        ))}
                    </InfiniteScroll>
                ) : (
                    <div className="nodata">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};

const Detail = ({ data }) => {
    const { details = [] } = data;
    const [showAll, setShowAll] = useState(() => {
        if (details.length <= 6) return true;
        else return false;
    });

    const listDetail = useMemo(() => {
        if (showAll || details.length <= 6) return details;
        else return details.slice(0, 6);
    }, [details, showAll]);

    const dateFormat = useMemo(() => {
        return moment(data.date).format('DD/MM/YYYY');
    }, [data.date]);

    const total = details.reduce(
        (prev, next) => operate(prev, next.money, '+'),
        0,
    );

    return (
        <div className="flex flex-row">
            <div className="line">
                <div className="cycle"></div>
            </div>
            <div className="history_content">
                <div className="flex justify-between items-center date">
                    <p>{dateFormat}</p>
                    <p>{numberWithCommas(round(total))} VNĐ</p>
                </div>
                {listDetail.map((bill) => (
                    <div
                        className="detail"
                        key={`${bill.code}-${bill.createdTime}`}
                    >
                        <div className="flex justify-between">
                            <p className="detail_invoice">{bill.code}</p>
                            <p className="detail_account">{bill.account}</p>
                        </div>
                        <div className="flex items-end detail_mt">
                            <p className="detail_time">
                                {moment(bill.createdTime).format('HH:mm')}
                            </p>
                            <p className="dashed"></p>
                            <p className="detail_money">
                                {numberWithCommas(round(bill.money))} VNĐ
                            </p>
                        </div>
                    </div>
                ))}
                {!showAll && (
                    <div onClick={() => setShowAll(true)} className="see-more">
                        Xem thêm...
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
