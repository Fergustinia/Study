#include <iostream>
#include <vector>
#include <cstdlib>
#include <chrono>
#include <cuda_runtime.h>

#define CUDA_CHECK(call)                                                \
do {                                                                    \
    cudaError_t err = call;                                             \
    if (err != cudaSuccess) {                                           \
        std::cerr << "CUDA error: " << cudaGetErrorString(err)          \
                  << " at line " << __LINE__ << std::endl;              \
        return 1;                                                       \
    }                                                                   \
} while (0)

__global__ void countCharsKernel(const unsigned char* text, int* counts, int n)
{
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n)
    {
        atomicAdd(&counts[text[idx]], 1);
    }
}

void countCharsCPU(const std::vector<unsigned char>& text, std::vector<int>& counts)
{
    for (size_t i = 0; i < text.size(); i++)
    {
        counts[text[i]]++;
    }
}

bool compareResults(const std::vector<int>& a, const std::vector<int>& b)
{
    for (int i = 0; i < 256; i++)
    {
        if (a[i] != b[i]) return false;
    }
    return true;
}

int main()
{
    const int n = 4000000; // 4 млн символов
    std::vector<unsigned char> h_text(n);

    srand(42);
    for (int i = 0; i < n; i++)
    {
        h_text[i] = 'A' + rand() % 26;
    }

    std::vector<int> cpuCounts(256, 0);
    std::vector<int> gpuCounts(256, 0);

    auto cpuStart = std::chrono::high_resolution_clock::now();
    countCharsCPU(h_text, cpuCounts);
    auto cpuEnd = std::chrono::high_resolution_clock::now();

    unsigned char* d_text = nullptr;
    int* d_counts = nullptr;

    CUDA_CHECK(cudaMalloc((void**)&d_text, n * sizeof(unsigned char)));
    CUDA_CHECK(cudaMalloc((void**)&d_counts, 256 * sizeof(int)));
    CUDA_CHECK(cudaMemset(d_counts, 0, 256 * sizeof(int)));

    auto gpuStart = std::chrono::high_resolution_clock::now();

    CUDA_CHECK(cudaMemcpy(d_text, h_text.data(), n * sizeof(unsigned char), cudaMemcpyHostToDevice));

    int threadsPerBlock = 256;
    int blocksPerGrid = (n + threadsPerBlock - 1) / threadsPerBlock;

    countCharsKernel<<<blocksPerGrid, threadsPerBlock>>>(d_text, d_counts, n);

    CUDA_CHECK(cudaGetLastError());
    CUDA_CHECK(cudaDeviceSynchronize());

    CUDA_CHECK(cudaMemcpy(gpuCounts.data(), d_counts, 256 * sizeof(int), cudaMemcpyDeviceToHost));

    auto gpuEnd = std::chrono::high_resolution_clock::now();

    bool isEqual = compareResults(cpuCounts, gpuCounts);

    auto cpuMs = std::chrono::duration_cast<std::chrono::milliseconds>(cpuEnd - cpuStart).count();
    auto gpuMs = std::chrono::duration_cast<std::chrono::milliseconds>(gpuEnd - gpuStart).count();

    std::cout << "Input size: " << n << " characters" << std::endl;
    std::cout << "CPU time: " << cpuMs << " ms" << std::endl;
    std::cout << "GPU time (copy + kernel + copy back): " << gpuMs << " ms" << std::endl;
    std::cout << "Results equal: " << (isEqual ? "true" : "false") << std::endl;

    std::cout << "\nCharacter counts:\n";
    for (int i = 0; i < 256; i++)
    {
        if (gpuCounts[i] > 0)
        {
            if (i >= 32 && i <= 126)
                std::cout << "'" << (char)i << "' : " << gpuCounts[i] << std::endl;
            else
                std::cout << "ASCII " << i << " : " << gpuCounts[i] << std::endl;
        }
    }

    cudaFree(d_text);
    cudaFree(d_counts);

    return 0;
}
