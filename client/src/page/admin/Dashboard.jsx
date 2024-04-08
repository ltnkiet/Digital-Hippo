import React, { useEffect, useState } from "react";
import { apiGetDashboard } from "api";
import { BoxInfor, CustomChart } from "components";
import { AiOutlineUserAdd } from "asset/icons";
import { formatPrice } from "utils/helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState();
  const [isMonth, setIsMonth] = useState(false);
  const [customTime, setCustomTime] = useState({
    from: "",
    to: "",
  });
  const fetchDataDashboard = async (params) => {
    const response = await apiGetDashboard(params);
    if (response.success) setData(response.data);
  };

  useEffect(() => {
    const type = isMonth ? "MTH" : "D";
    const params = { type };
    if (customTime.from) params.from = customTime.from;
    if (customTime.to) params.to = customTime.to;
    fetchDataDashboard(params);
  }, [isMonth, customTime]);
  const handleCustomTime = () => {
    setCustomTime({ from: "", to: "" });
  };

  const pieData = {
    labels: ["Tông đơn đã hủy", "Tổng đơn thành công"],
    datasets: [
      {
        label: "Tổng đơn",
        data: [
          data?.pieData?.find((el) => el.status === 0)?.sum,
          // data?.pieData?.find((el) => el.status === 1)?.sum,
          // data?.pieData?.find((el) => el.status === 2)?.sum,
          data?.pieData?.find((el) => el.status === 3)?.sum,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          // "rgba(127, 143, 154, 0.78)",
          // "rgba(205, 219, 31, 0.8)",
          "rgba(31, 219, 84, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          // "rgba(127, 143, 154, 0.78)",
          // "rgba(205, 219, 31, 0.8)",
          "rgba(31, 219, 84, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Thống kê</h1>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-4 gap-4">
          <BoxInfor
            text="Số thành viên mới"
            icon={<AiOutlineUserAdd size={22} />}
            number={data?.users[0]?.count}
            className="border-blue-500 text-white bg-blue-500"
          />
          <BoxInfor
            text="Số tiền đã được thanh toán"
            // icon={<img src="/dong.svg" className="h-6 object-contain" />}
            number={
              data?.totalSuccess?.length > 0
                ? formatPrice(Math.round(data?.totalSuccess[0]?.count * 24640))
                : 0
            }
            className="border-green-500 text-white bg-green-500"
          />
          <BoxInfor
            text="Số tiền chưa thanh toán"
            // icon={<img src="/dong.svg" className="h-6 object-contain" />}
            number={
              data?.totalFailed?.length > 0
                ? formatPrice(Math.round(data?.totalFailed[0]?.count * 24640))
                : 0
            }
            className="border-orange-500 text-white bg-orange-500"
          />
          <BoxInfor
            text="Số sản phẩm đã bán"
            // icon={<img src="/dong.svg" className="h-6 object-contain" />}
            number={
              data?.soldQuantities?.length > 0
                ? data?.soldQuantities[0]?.count
                : 0
            }
            className="border-yellow-500 text-white bg-yellow-500"
          />
        </div>
        <div className="mt-6 grid grid-cols-10 gap-4">
          <div className="col-span-7 min-h-[500px] border flex flex-col gap-4 relative rounded-md flex-auto p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-8">
                <span>{`Thống kê doanh thu theo ${
                  isMonth ? "tháng" : "ngày"
                }`}</span>
                <div className="flex items-center font-thin gap-8">
                  <span className="flex items-center gap-2">
                    <label htmlFor="from">Từ</label>
                    <input
                      type="date"
                      value={customTime.from}
                      onChange={(e) =>
                        setCustomTime((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                      id="from"
                    />
                  </span>
                  <span className="flex items-center gap-2">
                    <label htmlFor="from">Đến</label>
                    <input
                      type="date"
                      value={customTime.to}
                      onChange={(e) =>
                        setCustomTime((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                      id="to"
                    />
                  </span>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md border-blue-500 text-blue-500 border mr-2`}
                    onClick={handleCustomTime}>
                    Mặc định
                  </button>
                </div>
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border hover:border-main-blue ${
                    isMonth ? "" : "text-white font-semibold bg-main"
                  }`}
                  onClick={() => setIsMonth(false)}>
                  Ngày
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border hover:border-main-blue ${
                    isMonth ? "text-white font-semibold bg-main" : ""
                  }`}
                  onClick={() => setIsMonth(true)}>
                  Tháng
                </button>
              </span>
            </div>
            {data?.chartData && (
              <CustomChart
                customTime={customTime}
                isMonth={isMonth}
                data={data?.chartData}
              />
            )}
          </div>
          <div className="col-span-3 rounded-md border p-4">
            <span className="font-bold gap-8">
              Số người truy cập chưa đăng ký và đã đăng ký
            </span>
            <div>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
