---
title: AI Processing Units
tags:
  - technical
  - ai
  - tpu
  - npu
  - data-processing
author: viktor
---
# AI Processing Units

## The basic idea: general-purpose vs specialized processors

A **processor** is hardware that executes operations on data.

The familiar **CPU (Central Processing Unit)** is a **general-purpose processor**.
It is designed to perform many different kinds of operations:

- arithmetic
- logic
- comparisons
- memory operations
- branching
- program control

This flexibility makes CPUs suitable for running operating systems and general software.

However, if a task consists of performing the same relatively simple calculation millions or billions of times, it can be more efficient to build hardware specifically optimized for that calculation.

This is the basic idea behind **hardware accelerators**.

---

## What is special about AI computation?

There is nothing inherently "AI" about the arithmetic performed by a neural network.

At the hardware level, neural networks mostly perform enormous numbers of ordinary mathematical operations.

One particularly important operation is:

$$
a \times b + c
$$

This is called a **MAC (Multiply-Accumulate)** operation.

A typical neural-network calculation can be written as:

$$
y_i = \sum_j w_{ij}x_j + b_i
$$

where:

- $x$ = input values
- $w$ = learned weights
- $b$ = bias
- $y$ = output

A neural network may need millions or billions of these operations to process a single input.

!!! info "Important"
    There is no special "AI arithmetic".
    AI accelerators perform ordinary arithmetic, but their hardware is arranged specifically to perform the operations common in neural networks very efficiently.

---

## Why parallel processing matters

Many neural-network calculations are independent and can therefore be performed **at the same time**.

A processor could perform operations sequentially:

```text
MAC 1 → MAC 2 → MAC 3 → MAC 4 → ...
```

Alternatively, hardware can contain many arithmetic units:

```text
        ┌─ MAC ─┐
        ├─ MAC ─┤
input → ├─ MAC ─┤ → results
        ├─ MAC ─┤
        ├─ MAC ─┤
        └─ MAC ─┘

      simultaneously
```

This is **parallel processing**.

!!! tip "Intuition"
    Instead of one very capable worker performing thousands of similar jobs one after another, use many simpler workers to perform those jobs simultaneously.

---

## ALUs, MAC units and processing elements

A normal CPU contains **ALUs (Arithmetic Logic Units)** and other execution units.

An ALU can perform operations such as:

```text
addition
subtraction
AND / OR / XOR
comparisons
shifts
```

CPUs also contain other specialized units for operations such as floating-point and vector arithmetic.

An AI accelerator dedicates much more of its hardware to the particular numerical operations needed by neural networks.

Conceptually:

```text
CPU

ALU     ALU     Vector/FPU
 ↓       ↓          ↓
Flexible general-purpose computation


AI accelerator

MAC MAC MAC MAC MAC MAC
MAC MAC MAC MAC MAC MAC
MAC MAC MAC MAC MAC MAC
MAC MAC MAC MAC MAC MAC
         ↓
Large parallel numerical operations
```

Depending on the architecture, these units may be called:

- **MAC units** — Multiply-Accumulate units
- **PEs** — Processing Elements
- **matrix units**
- **tensor units**

So it is reasonable to think of an AI accelerator as containing **large numbers of specialized arithmetic units optimized for neural-network mathematics**.

---

# CPU, GPU and AI Accelerators

## CPU — Central Processing Unit

A **CPU** is designed for general-purpose computing.

It usually contains a relatively small number of powerful and sophisticated processing cores.

```text
CPU

Core    Core    Core    Core
 │       │       │       │
complex general-purpose processing
```

CPUs are particularly good at:

- operating systems
- program control
- branching
- sequential algorithms
- general applications
- coordinating other hardware

A CPU can run a neural network, but it may not be the fastest or most energy-efficient way to do so.

---

## GPU — Graphics Processing Unit

A **GPU (Graphics Processing Unit)** was originally designed for computer graphics.

Graphics requires performing similar calculations on enormous numbers of pixels and vertices.

For example:

```text
pixel 1 ─┐
pixel 2 ─┤
pixel 3 ─┤
pixel 4 ─┤ → similar calculations in parallel
...      │
pixel N ─┘
```

GPUs therefore evolved to contain large numbers of parallel arithmetic units.

Neural networks also require large numbers of similar mathematical operations, so GPUs turned out to be very suitable for machine learning.

Conceptually:

```text
CPU
few powerful, flexible cores

GPU
many parallel processing units
```

GPUs are widely used for both:

- **training**
- **inference**

of neural networks.

---

## NPU — Neural Processing Unit

An **NPU (Neural Processing Unit)** is hardware specifically designed to accelerate neural-network calculations.

Unlike a CPU, an NPU does not need to be good at every type of computation.

Instead, much of its hardware is optimized for operations such as:

- matrix multiplication
- convolution
- multiply-accumulate operations
- vector operations

Conceptually:

```text
                 PROCESSING

                     │
        ┌────────────┼────────────┐
        │            │            │
       CPU          GPU          NPU
        │            │            │
    general       parallel      neural-network
    purpose       computing     acceleration
```

**NPU is a generic category**, not one particular processor design.

Different manufacturers use different names for their AI accelerators.

---

## TPU — Tensor Processing Unit

**TPU = Tensor Processing Unit**

TPU is Google's name for a family of processors specifically designed for machine-learning workloads.

The word **tensor** refers to the multidimensional arrays of numbers used extensively in machine learning.

For example:

A scalar:

$$
5
$$

A vector:

$$
[2,5,7]
$$

A matrix:

$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$

Higher-dimensional arrays are generally called **tensors**.

Neural networks perform large numbers of operations on these arrays.

A TPU therefore contains hardware optimized for this type of computation.

!!! info "Important"
    **NPU** is a broad generic term for neural-network acceleration.
    **TPU** is Google's terminology for its own family of machine-learning processors.
    They describe similar broad ideas but are not interchangeable names for identical hardware.

---

# Google Coral Edge TPU

The **Google Coral Edge TPU** is a small TPU designed specifically for **edge inference**.

For example, with a Raspberry Pi and USB Coral accelerator:

```text
Raspberry Pi
     │
     │ USB
     ▼
Coral Edge TPU
```

The Raspberry Pi CPU still runs:

- Linux
- Python or other application code
- input/output
- preprocessing
- program logic

The Edge TPU performs the supported neural-network calculations.

Conceptually:

```text
camera
   ↓
Raspberry Pi CPU
   ↓
preprocessing
   ↓
Coral Edge TPU
   ↓
neural-network inference
   ↓
prediction
   ↓
Raspberry Pi CPU
   ↓
application decides what to do
```

The Coral therefore **does not replace the CPU**.

It is an **accelerator** used by the CPU.

---

# Training vs inference

This distinction is important when discussing AI processors.

## Training

During training:

```text
training data
     ↓
neural network
     ↓
prediction
     ↓
calculate error
     ↓
adjust weights
     ↓
repeat
```

Training determines the parameters or **weights** of the neural network.

Training is computationally expensive and is commonly performed using powerful GPUs or specialized data-centre accelerators.

## Inference

Once the network has been trained:

```text
new input
    ↓
neural network
using learned weights
    ↓
prediction
```

This is called **inference**.

The network is no longer learning its weights.
It is using the already learned weights to process new data.

The Coral Edge TPU is primarily an **inference accelerator**.

---

# MCU — Microcontroller Unit

An **MCU (Microcontroller Unit)** is somewhat different from CPU/GPU/NPU terminology.

A microcontroller is essentially a **small computer integrated onto a chip**, designed primarily for controlling embedded devices.

Examples include microcontrollers used in:

- Arduino boards
- STM32 systems
- ESP32 devices
- sensors
- robots
- appliances
- motor controllers
- wearable devices

A typical MCU contains:

```text
       Microcontroller
┌─────────────────────────┐
│                         │
│ CPU core                │
│                         │
│ RAM                     │
│ Flash                   │
│                         │
│ timers                  │
│ ADC / DAC               │
│ GPIO                    │
│ serial interfaces       │
│                         │
└─────────────────────────┘
```

Unlike a Raspberry Pi, an MCU commonly runs a small embedded program directly rather than a full desktop-style operating system.

MCUs are designed to be:

- inexpensive
- small
- predictable
- low power
- suitable for real-time hardware control

---

# TinyML

Traditionally, neural networks required more processing power and memory than small microcontrollers could provide.

However, small optimized neural networks can now run directly on MCUs.

This is commonly called **TinyML**.

For example:

```text
microphone
    ↓
microcontroller
    ↓
small neural network
    ↓
"glass breaking detected"
```

This can happen locally without:

- a PC
- a Raspberry Pi
- cloud processing
- an internet connection

TinyML is particularly useful for:

- battery-powered sensors
- wearables
- environmental monitoring
- audio detection
- predictive maintenance
- small robots

---

# Arm

**Arm** is a company that designs processor architectures and processor cores.

A key distinction is that Arm generally **designs and licenses processor technology** rather than manufacturing the final chips itself.

A semiconductor manufacturer can license an Arm CPU design and incorporate it into its own chip.

One important Arm family is:

```text
Arm Cortex
    │
    ├── Cortex-A
    │
    ├── Cortex-R
    │
    └── Cortex-M
```

Very roughly:

| Family | Main use |
|---|---|
| Cortex-A | Application processors |
| Cortex-R | Real-time processors |
| Cortex-M | Microcontrollers |

---

## Cortex-A

**Cortex-A** processors are relatively powerful application processors.

They are suitable for running operating systems such as Linux and are commonly found in devices such as phones and embedded Linux computers.

They are much closer conceptually to the processors found in a Raspberry Pi than to a simple Arduino-style microcontroller.

---

## Cortex-R

**Cortex-R** processors are designed for systems requiring predictable **real-time behaviour** and high reliability.

They are used in applications such as:

- automotive systems
- storage controllers
- industrial systems

---

## Cortex-M

**Cortex-M** is Arm's microcontroller processor family.

These processors are designed for:

- low power consumption
- embedded control
- real-time systems
- relatively small devices

A microcontroller manufacturer can therefore build an MCU containing a Cortex-M CPU core.

Conceptually:

```text
MCU
┌────────────────────────────┐
│                            │
│ Cortex-M CPU               │
│                            │
│ RAM                        │
│ Flash                      │
│ GPIO                       │
│ ADC                        │
│ timers                     │
│ communication interfaces   │
│                            │
└────────────────────────────┘
```

!!! info "Important"
    **MCU and Cortex-M do not mean the same thing.**
    The MCU is the complete microcontroller chip.
    Cortex-M is a CPU core that can be included inside that chip.

---

# Cortex-M55

The **Arm Cortex-M55** is a particular member of the Cortex-M family.

It is still a **CPU core**, not an NPU.

However, it was designed with signal processing and machine-learning workloads in mind.

It includes Arm's **Helium** technology, which provides vector-processing capabilities.

Vector processing allows one instruction to operate on several values:

```text
Normal scalar operation:

A1 × B1
A2 × B2
A3 × B3
A4 × B4

performed separately


Vector operation:

[A1 A2 A3 A4]
      ×
[B1 B2 B3 B4]

processed together
```

This makes the Cortex-M55 considerably better suited to DSP and machine-learning calculations than a simple MCU CPU.

A Cortex-M55 can therefore run small neural networks **without a separate NPU**.

---

# Ethos-U55

The **Arm Ethos-U55** is different.

It is a dedicated **NPU** designed for embedded and microcontroller-class systems.

It can be combined with a Cortex-M CPU.

For example:

```text
MCU / SoC

┌─────────────────────────────┐
│                             │
│ Cortex-M55                  │
│     CPU                     │
│      │                      │
│      ▼                      │
│ Ethos-U55                   │
│     NPU                     │
│                             │
│ RAM / Flash                 │
│ peripherals                 │
│                             │
└─────────────────────────────┘
```

The Cortex-M55 can handle:

- program logic
- sensors
- communication
- hardware control
- preprocessing

while the Ethos-U55 accelerates the neural network.

For example:

```text
microphone
    ↓
Cortex-M55
    ↓
audio preprocessing
    ↓
Ethos-U55
    ↓
neural network
    ↓
"bat detected: 97%"
    ↓
Cortex-M55
    ↓
save recording
```

The relationship is therefore conceptually similar to:

```text
Raspberry Pi CPU + Coral Edge TPU
```

versus:

```text
Cortex-M55 CPU + Ethos-U55 NPU
```

!!! note
    Both use a **general-purpose/control processor + specialized AI accelerator**, but they target very different power and performance levels.

---

# SoC — System on Chip

A **SoC (System on Chip)** combines many parts of a computer onto a single physical chip.

A modern SoC might contain:

```text
                  SoC
┌─────────────────────────────────┐
│                                 │
│ CPU cores                       │
│                                 │
│ GPU                             │
│                                 │
│ NPU                             │
│                                 │
│ memory controller               │
│                                 │
│ image processor                 │
│                                 │
│ video encoder / decoder         │
│                                 │
│ USB / networking / interfaces   │
│                                 │
└─────────────────────────────────┘
```

Therefore, statements such as:

!!! note
    "This chip has a CPU, GPU and NPU" do not necessarily mean there are three physical chips.
    They may be three different **processing blocks inside one SoC**.
    Smartphone processors are good examples of this approach.

---

# Edge AI

**Edge AI** means performing AI inference locally, close to where the data is generated, rather than sending the data to a remote server or cloud service.

For example:

```text
Cloud processing

camera
   ↓
internet
   ↓
server / GPU
   ↓
prediction
   ↓
internet
   ↓
device
```

versus:

```text
Edge AI

camera
   ↓
local NPU / TPU
   ↓
prediction
```

Advantages can include:

- lower latency
- reduced network traffic
- operation without internet access
- improved privacy
- lower cloud-computing requirements

Google Coral and Cortex-M + Ethos systems are both examples of hardware that can be used for edge AI, although at very different scales.

---

# Performance: more units = faster?

Generally, having more parallel arithmetic units means an accelerator has the **potential** to perform more operations simultaneously.

For example:

```text
100 MAC units
→ potentially 100 MAC calculations in parallel

1000 MAC units
→ potentially 1000 MAC calculations in parallel
```

However, simply adding arithmetic units does not guarantee proportional performance.

The processing units need a continuous supply of:

- input data
- neural-network weights
- intermediate results

If memory cannot supply data quickly enough, processing units may sit idle.

!!! tip "Intuition"
    A factory with 100 workers is potentially faster than one with 10 workers, but only if enough materials can reach all 100 workers.

Performance therefore depends on factors including:

- number of processing units
- clock frequency
- memory bandwidth
- memory architecture
- numerical precision
- supported operations
- accelerator architecture
- neural-network architecture

---

# TOPS

AI accelerator performance is often advertised in **TOPS**.

**TOPS = Tera Operations Per Second**

$$
1\ \text{TOPS} = 10^{12}\ \text{operations per second}
$$

A processor rated at 4 TOPS can theoretically perform trillions of supported operations per second.

However:

!!! info "Important"
    TOPS is a theoretical throughput figure, not a direct measurement of real-world AI performance.

Two processors with the same TOPS rating can perform very differently because of:

- memory bandwidth
- architecture
- numerical precision
- software
- supported neural-network operations
- utilization of the processing units

TOPS comparisons therefore need context.

---

# Numerical precision and quantization

Neural-network calculations operate on numbers.

These numbers can be represented at different **precisions**.

Examples include:

```text
FP32    32-bit floating point
FP16    16-bit floating point
INT8     8-bit integer
```

Higher precision can represent numbers more accurately but requires:

- more memory
- more memory bandwidth
- more computation
- often more power

For many inference tasks, full FP32 precision is unnecessary.

A trained model can often be converted to lower-precision numbers such as **INT8**.

This is called **quantization**.

Conceptually:

```text
FP32 model
32 bits per value

      ↓ quantization

INT8 model
8 bits per value
```

This can make the model:

- smaller
- faster
- less memory intensive
- more energy efficient

while often retaining sufficient prediction accuracy.

This is particularly important for small edge accelerators.

For example, the Google Coral Edge TPU is strongly optimized around **8-bit quantized inference**.

---

# Putting the terminology together

The terms describe different levels and types of hardware.

```text
PROCESSING HARDWARE
│
├── CPU
│   │
│   ├── general-purpose processor
│   │
│   └── Arm Cortex-M55 is an example of a CPU core
│
├── GPU
│   │
│   └── highly parallel processor originally designed for graphics
│
├── AI accelerator
│   │
│   ├── NPU
│   │   └── Arm Ethos-U55 is an example
│   │
│   └── TPU
│       └── Google Edge TPU is an example
│
├── MCU
│   │
│   └── complete small embedded computer that contains a CPU
│
└── SoC
    │
    └── complete chip that may contain:
        CPU + GPU + NPU + memory interfaces + peripherals
```

Another useful way of looking at it is:

```text
                    COMPUTATION
                         │
          ┌──────────────┴──────────────┐
          │                             │
   GENERAL PURPOSE                 SPECIALIZED
          │                             │
         CPU                   hardware accelerators
          │                             │
          │                    ┌────────┴────────┐
          │                   GPU              NPU/TPU
          │
   ┌──────┴──────┐
Cortex-A      Cortex-M
                  │
             Cortex-M55


Example embedded AI system:

        Cortex-M55
            CPU
             │
             ▼
        Ethos-U55
            NPU


Example Coral system:

      Raspberry Pi
           CPU
            │
            ▼
       Edge TPU
     AI accelerator
```

# Key takeaways

!!! info "Important"
    - **CPU** = flexible general-purpose processor.
    - **GPU** = highly parallel processor originally designed for graphics, but very useful for neural-network computation.
    - **NPU** = generic term for a processor/accelerator specialized for neural networks.
    - **TPU** = Google's name for its family of specialized machine-learning processors.
    - **MCU** = a small complete embedded computer on a chip.
      It contains a CPU and usually memory and peripherals.
    - **SoC** = a chip integrating several major computer components, potentially including CPU, GPU and NPU.
    - **Cortex-M55** = an Arm CPU core designed for embedded systems, with strong vector/DSP/ML capabilities.
    - **Ethos-U55** = an Arm NPU designed to accelerate neural networks in embedded systems.
    - **Coral Edge TPU** = Google's edge inference accelerator.
      It performs neural-network calculations alongside a host CPU.

The central idea connecting all of these is simple:

Neural networks require enormous numbers of relatively simple arithmetic operations.
AI accelerators gain efficiency by dedicating large amounts of hardware to performing those operations in parallel.