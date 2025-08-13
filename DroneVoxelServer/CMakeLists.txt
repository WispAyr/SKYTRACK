cmake_minimum_required(VERSION 3.18)
project(DroneVoxelServer VERSION 0.2.0 LANGUAGES CXX CUDA)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# CUDA settings
set(CMAKE_CUDA_STANDARD 17)
set(CMAKE_CUDA_STANDARD_REQUIRED ON)
set(CMAKE_CUDA_ARCHITECTURES "75;86;89")  # RTX 20/30/40 series

# Find required packages
find_package(OpenCV REQUIRED)
find_package(Eigen3 REQUIRED)
find_package(CUDA REQUIRED)

# Include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    ${EIGEN3_INCLUDE_DIR}
    ${CUDA_INCLUDE_DIRS}
)

# Source files
file(GLOB_RECURSE SOURCES 
    "core/voxel/*.cpp"
    "core/voxel/*.cu"
    "core/fusion/*.cpp"
    "core/tracking/*.cpp"
    "core/calib/*.cpp"
)

# Create library
add_library(drone_voxel_core STATIC ${SOURCES})

# Set properties
set_target_properties(drone_voxel_core PROPERTIES
    CUDA_SEPARABLE_COMPILATION ON
    POSITION_INDEPENDENT_CODE ON
)

# Link libraries
target_link_libraries(drone_voxel_core
    ${OpenCV_LIBS}
    Eigen3::Eigen
    ${CUDA_LIBRARIES}
    ${CUDA_CUDART_LIBRARY}
)

# Compiler flags
target_compile_options(drone_voxel_core PRIVATE
    $<$<CXX_COMPILER_ID:GNU>:-Wall -Wextra -O3 -march=native>
    $<$<CXX_COMPILER_ID:Clang>:-Wall -Wextra -O3 -march=native>
)

# CUDA specific flags
set_target_properties(drone_voxel_core PROPERTIES
    CUDA_NVCC_FLAGS "-O3 -arch=sm_75 -arch=sm_86 -arch=sm_89"
)

# Install
install(TARGETS drone_voxel_core
    ARCHIVE DESTINATION lib
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)

install(DIRECTORY include/ DESTINATION include)

# Testing
enable_testing()
add_subdirectory(tests)
