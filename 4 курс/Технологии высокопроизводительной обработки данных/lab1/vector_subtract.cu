#include <iostream>
#include <vector>
#include <cuda_runtime.h>

__global__ void subtractVectors(const float* a, const float* b, float* c, int n)
{
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n)
    {
        c[idx] = a[idx] - b[idx];
    }
}

int main()
{
    int n = 1000000; // 1 млн элементов
    size_t size = n * sizeof(float);

    std::vector<float> h_a(n), h_b(n), h_c(n);

    for (int i = 0; i < n; i++)
    {
        h_a[i] = (float)i;
        h_b[i] = (float)i * 0.5f;
    }

    float* d_a = nullptr;
    float* d_b = nullptr;
    float* d_c = nullptr;

    cudaMalloc((void**)&d_a, size);
    cudaMalloc((void**)&d_b, size);
    cudaMalloc((void**)&d_c, size);

    cudaMemcpy(d_a, h_a.data(), size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, h_b.data(), size, cudaMemcpyHostToDevice);

    int threadsPerBlock = 256;
    int blocksPerGrid = (n + threadsPerBlock - 1) / threadsPerBlock;

    subtractVectors<<<blocksPerGrid, threadsPerBlock>>>(d_a, d_b, d_c, n);
    cudaDeviceSynchronize();

    cudaMemcpy(h_c.data(), d_c, size, cudaMemcpyDeviceToHost);

    std::cout << "Vector size: " << n << std::endl;
    std::cout << "First 10 results:" << std::endl;
    for (int i = 0; i < 10; i++)
    {
        std::cout << h_a[i] << " - " << h_b[i] << " = " << h_c[i] << std::endl;
    }

    cudaFree(d_a);
    cudaFree(d_b);
    cudaFree(d_c);

    return 0;
}
