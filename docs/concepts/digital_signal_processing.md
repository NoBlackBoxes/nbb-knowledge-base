---
title: Digital signal processing
tags:
  - technical
  - signal-processing
author: viktor
---

# Digital Sampling, Bit Depth, ADCs and Data Size

An electrophysiology signal starts as a **continuous analogue voltage signal**.
To store it digitally, we must discretise it in two dimensions:

- **Sampling rate** discretises **time** (x-axis).
- **Bit depth / ADC resolution** discretises **amplitude** (y-axis).

!!! info "Important"
    Sampling rate determines **how often we measure** the signal.
    Bit depth determines **how precisely we can represent the amplitude** of each measurement.

## Sampling rate

A sampling rate of **30 kHz** means:

$$
30,000\ \text{samples/second}
$$

The continuous voltage is therefore measured once every:

$$
\frac{1}{30,000}\approx33.3\ \mu s
$$

Each of these measurements produces one digital value per channel.

So for one channel:

- 1 second → 30,000 samples
- 1 minute → 1,800,000 samples
- 1 hour → 108,000,000 samples

## Bit depth and amplitude resolution

An ADC converts the analogue voltage at each sampling instant into a digital number.

With $N$ bits, there are:

$$
2^N
$$

possible binary combinations and therefore up to that many digital codes.

For example:

| Bits | Possible codes |
|---:|---:|
| 1 | 2 |
| 2 | 4 |
| 3 | 8 |
| 10 | 1,024 |
| 12 | 4,096 |
| 16 | 65,536 |

Imagine an ADC measuring a voltage range from 0–5 V.

A **1-bit ADC** has only two codes:

```text
0
1
```

It can only divide the input range into two regions.

A **2-bit ADC** has four codes:

```text
00
01
10
11
```

so it can divide the voltage range into four regions.

More bits therefore mean **finer amplitude resolution**.

!!! info "Important"
    Increasing the sampling rate gives more measurements **along time**.
    Increasing the ADC bit depth gives more possible values **along amplitude**.

## Quantisation

The actual analogue voltage will usually fall between the ADC's available digital levels.

The ADC therefore assigns it to an appropriate discrete code.
This process is called **quantisation**.

The difference between the actual analogue value and its digital representation is **quantisation error**.

More ADC bits → more levels → smaller steps → smaller quantisation error.

For an ideal ADC covering a total voltage range $V_\text{range}$:

$$
\text{step size}\approx\frac{V_\text{range}}{2^N}
$$

The exact mapping depends on the ADC architecture and coding convention, but this is the useful intuition.

## What does a binary number mean?

A bit can have two states:

```text
0 or 1
```

A 16-bit word contains 16 such positions:

```text
0110100101011010
```

Binary works like decimal positional notation, except that the positions represent **powers of 2 rather than powers of 10**.

For example:

Decimal:

```text
347

= 3×100 + 4×10 + 7×1
= 3×10² + 4×10¹ + 7×10⁰
```

Binary:

```text
2³ = 8
2² = 4
2¹ = 2
2⁰ = 1
```

```text
Binary:   1  0  1  1
Value:    8  4  2  1

1×8 + 0×4 + 1×2 + 1×1
= 8 + 0 + 2 + 1
= 11
```

Therefore:

$$
1011_2 = 8+2+1=11_{10}
$$

### Why does a 16-bit number start at $2^{15}$?

This is an easy source of confusion.

There are **16 positions**, but they are numbered from 0:

```text
Position: 15 14 13 ... 3 2 1 0
Power:    2¹⁵ 2¹⁴ 2¹³ ... 2³ 2² 2¹ 2⁰
```

So an unsigned 16-bit number ranges from:

$$
0
$$

to:

$$
2^{16}-1=65,535
$$

giving **65,536 possible combinations**.

Leading zeros do not contribute to the value:

```text
0000000000001011
```

has the same numerical value as:

```text
1011
```

The leftmost `1` identifies the largest power of two contributing to the number.

### Example

For:

```text
0110100101011010
```

the bits that are `1` correspond to:

$$
2^{14}+2^{13}+2^{11}+2^8+2^6+2^4+2^3+2^1
$$

Therefore:

$$
16384+8192+2048+256+64+16+8+2=26970
$$

!!! note
    Computers do not normally convert a binary value into decimal before doing calculations with it.
    The binary representation **is the number internally**.
    Decimal notation is primarily a human-readable representation.

## Signed integers

Electrophysiology signals can be positive or negative relative to a reference.

A signed 16-bit integer (`int16`) usually uses **two's-complement representation**, giving the range:

$$
-32,768\ \text{to}\ 32,767
$$

This is still exactly $2^{16}=65,536$ possible bit patterns.

The same 16-bit pattern can therefore represent a different numerical value depending on whether software interprets it as **unsigned** or **signed**.

## What does the ADC actually do?

Conceptually:

```text
continuous voltage
        ↓
sample voltage at one instant
        ↓
ADC quantises amplitude
        ↓
digital code
        ↓
binary representation
```

At 30 kHz, this happens **30,000 times every second per channel**.

The stored number is an **ADC count/code**, not inherently a voltage such as `37 µV`.

Calibration and gain information allow software to convert the stored number into physical voltage units later.

## Physical representation of bits

At the physical level, bits correspond to distinguishable electronic states.

A useful simplified picture is:

```text
LOW  → 0
HIGH → 1
```

but a bit does **not necessarily mean one transistor**.

Different technologies implement memory cells differently:

- **SRAM:** commonly about 6 transistors per bit
- **DRAM:** commonly 1 transistor + 1 capacitor per bit
- **Flash:** charge stored in specialised transistor structures; modern flash can encode multiple bits per cell

So a 16-bit number corresponds conceptually to **16 binary storage positions**, but not necessarily exactly 16 physical transistors.

## Sampling rate and Nyquist

Sampling introduces another limitation independent of bit depth.

To reconstruct a band-limited signal without aliasing, the sampling frequency must be greater than twice the highest frequency present:

$$
f_s > 2f_\text{max}
$$

This is the **Nyquist criterion**.

The corresponding Nyquist frequency is:

$$
f_N=\frac{f_s}{2}
$$

For a 30 kHz recording:

$$
f_N=15\text{ kHz}
$$

Therefore frequencies above 15 kHz cannot be uniquely represented by samples taken at 30 kHz and must normally be removed by an **anti-aliasing filter before sampling**.

## Aliasing

If the signal contains frequencies above the Nyquist frequency, different continuous signals can produce **exactly the same sequence of sampled values**.

For example, consider:

```text
signal frequency   = 6 Hz
sampling frequency = 8 Hz
```

The Nyquist frequency is:

$$
\frac{8}{2}=4\text{ Hz}
$$

The 6 Hz signal is above Nyquist.

When sampled at 8 Hz, it can appear as a lower-frequency **2 Hz alias**.

The crucial idea is:

!!! info "Important"
    From the samples alone, we cannot determine which of the possible continuous waveforms generated them.

This is fundamentally different from poor bit depth.

- **Low bit depth:** uncertainty/error in **amplitude**
- **Low sampling rate:** uncertainty/error in **time/frequency content**

Increasing bit depth cannot fix aliasing.

## Data size

For uncompressed data:

$$
\text{size}=
\text{sampling rate}
\times
\text{storage bits/sample}
\times
\text{channels}
\times
\text{duration}
$$

For **one channel at 30 kHz stored as 16-bit values**:

$$
30,000\times16=480,000\text{ bits/s}
$$

Since 8 bits = 1 byte:

$$
60,000\text{ bytes/s}
$$

Approximately:

| Duration | 16-bit | 32-bit |
|---:|---:|---:|
| 1 second | 60 kB | 120 kB |
| 1 minute | 3.6 MB | 7.2 MB |
| 1 hour | 216 MB | 432 MB |

Doubling the storage representation from 16 to 32 bits therefore **doubles the data size**.

## Neuropixels example

For 384 channels sampled at 30 kHz and stored as 16-bit values:

$$
384\times30,000\times2
=
23,040,000\text{ bytes/s}
$$

approximately **23 MB/s**.

This gives roughly:

| Duration | 16-bit storage | 32-bit storage |
|---:|---:|---:|
| 1 second | 23 MB | 46 MB |
| 1 minute | 1.38 GB | 2.76 GB |
| 1 hour | 82.9 GB | 165.9 GB |

These are approximate decimal sizes and ignore file headers and other overhead.

## ADC resolution is not the same as storage bit depth

This distinction is particularly important for Neuropixels.

The **ADC resolution** describes how many bits of measurement information the ADC produces.

The **storage data type** describes how many bits the computer allocates to store each sample.

These do not have to be equal.

For example, a system could have:

```text
ADC measurement → 10-bit code
                       ↓
stored on disk  → 16-bit integer
                       ↓
processing      → 32-bit floating point
```

Converting a 10-bit measurement into `int16` or `float32` **does not create additional measurement precision**.

It only changes the representation used by the computer.

!!! info "Important"
    **ADC bits = measurement resolution**
    **Storage bits = space allocated to represent the measurement**
    **Processing data type = representation used while performing calculations**

Neuropixels raw data are commonly stored as **16-bit integers**, even though the effective/on-probe ADC resolution can be lower and depends on the Neuropixels generation and acquisition path.

During analysis, software may convert the raw integer values to `float32` for filtering, scaling, whitening and other mathematical operations.
This approximately doubles RAM requirements relative to `int16`, but it does **not** increase the precision of the original measurement.

## The complete picture

```text
Continuous analogue voltage
          ↓
sample in time
          ↓
ADC quantises amplitude
          ↓
binary ADC code
          ↓
represented in a standard data type (e.g. int16)
          ↓
buffered in memory
          ↓
written to disk
          ↓
possibly converted to float32 for analysis
```

!!! abstract "Summary"
    **Sampling rate** tells us how finely we measure **time**.
    **ADC bit depth** tells us how finely we measure **amplitude**.
    **Nyquist** tells us the highest signal frequency that can be represented without aliasing.
    **Storage bit depth** tells us how much computer memory/disk space is allocated to each stored sample.
    These are related, but they are **not the same thing**.
