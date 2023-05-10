<template>
  <div class="flex flex-col gap-2">
    <Line :data="getData()" :options="options"></Line>
    <div class="flex gap-1 font-semibold text-xs text-neutral-400 w-full">
      <template v-for="filter in filterOptions">
        <button @click="selectedFilter = filter.value" class="px-1.5 py-0.5 bg-neutral-700 hover:bg-neutral-600 rounded" :class="{ 'text-amber-500': selectedFilter === filter.value }">{{ filter.name }}</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Sale} from "~/types/sale";
// @ts-ignore
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import {Line} from "vue-chartjs";
import {defineProps, ref} from "vue";

const filterOptions = [
  { name: "Last Week", value: "last-week" },
  { name: "Last 14D", value: "last-14d" },
  { name: "Last Month", value: "last-month" },
  { name: "Last 90D", value: "last-90d" }
];

const props = defineProps({
  sales: {
    type: Array as () => Sale[],
    required: true,
  },
});

const selectedFilter = ref<string>('last-14d');

const options = {
  spanGaps: true,
  plugins: {
    legend: false,
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = getLabels()[0][context.dataIndex];
          const value = context.dataset.data[context.dataIndex] || 0;

          const salesOnDay = filterSales().filter((sale) => {
            const date = new Date(sale.date_sold);
            return date.toLocaleDateString() === label;
          });

          const numSales = salesOnDay.length;

          return "Avg Price (ETH): " + value.toFixed(4) + " (Num Sales: " + numSales + ")";
        },
      }
    }
  },
  responsive: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function getLabels() {
  const today = new Date();
  const labels: [string[], string[]] = [[], []];
  let days = 0;

  switch (selectedFilter.value) {
    case "last-week":
      days = 7;
      break;
    case "last-14d":
      days = 14;
      break;
    case "last-month":
      days = 31;
      break;
    case "last-90d":
      days = 90;
      break;
    case "last-year":
      days = 365;
      break;
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    labels[0].push(date.toLocaleDateString());

    const dayOfMonth = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });

    labels[1].push(`${monthName} ${dayOfMonth}`);
  }

  return labels;
}

function filterSales(): Sale[] {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last14Days = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const last90Days = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
  const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  let startDate = new Date();

  switch (selectedFilter.value) {
    case 'last-14d':
      startDate = last14Days;
      break;
    case 'last-month':
      startDate = lastMonth;
      break;
    case 'last-90d':
      startDate = last90Days;
      break;
    case 'last-year':
      startDate = lastYear;
      break;
    default:
      startDate = lastWeek;
      break;
  }

  return props.sales.filter((sale) => {
    const dateSold = new Date(sale.date_sold);
    return dateSold >= startDate;
  });
}


function getData() {
  const sales = filterSales();
  const labels = getLabels();

  const data = {
    labels: labels[1],
    datasets: [
      {
        label: 'Avg Price (ETH)',
        data: Array(labels[0].length).fill([0]),
        backgroundColor: "#F59E0BFF",
        borderColor: "#D97706FF",
        pointRadius: 4,
      },
    ],
  };

  data.datasets[0].data = data.datasets[0].data.map((totalPrice, index) => {
    const salesOnDay = sales.filter((sale) => {
      const date = new Date(sale.date_sold);
      return sale.payment_token.symbol === "ETH" && date.toLocaleDateString() === labels[0][index];
    });

    if (salesOnDay.length === 0) {
      return null;
    }

    const totalSalePrice = salesOnDay.reduce((total, sale) => {
      return total + sale.payment_token.base_price / 1000000000000000000;
    }, 0);

    return totalSalePrice / salesOnDay.length;
  });

  return data;
}
</script>
