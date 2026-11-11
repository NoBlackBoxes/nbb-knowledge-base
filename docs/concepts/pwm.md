---
title: Pulse Width Modulation
tags:
- technical
- arduino
- electronics
- hardware
author: viktor
---

# Pulse Width Modulation (PWM)

## Core idea

**Pulse Width Modulation (PWM)** controls the effective output of a digital signal by changing **how long it stays ON during each cycle**.

The signal itself remains digital:

- **ON** = full voltage, e.g. 5 V
- **OFF** = 0 V

It does **not** generate intermediate voltages directly.

The **duty cycle** is the fraction of each PWM period spent ON:

- 10% duty cycle → ON 10% of the time
- 50% duty cycle → ON 50% of the time
- 90% duty cycle → ON 90% of the time

For a 0–5 V PWM signal, its time-averaged voltage is approximately:

$$
V_{\mathrm{avg}} = D V_{\mathrm{max}}
$$

where $D$ is the duty cycle from 0 to 1. Thus, 50% duty cycle has an average of 2.5 V.

!!! info "Important"
    The PWM pin is **not actually producing 2.5 V**. It is rapidly switching between 0 V and 5 V.  
    2.5 V is its **time average**.


The **time-averaged voltage** is a mathematical average, not a voltage the PWM pin actually produces. It is useful because systems that respond slowly compared with the PWM switching can respond approximately to this average. We call the resulting response the **effective output level**.

For example, a 50% duty cycle can produce approximately half the average light output of an LED, or a filtered voltage of 2.5 V from a 0–5 V PWM signal.

!!! note
    The effective response depends on the system. Half the average voltage does not necessarily mean half the motor speed, perceived brightness, or electrical power.

---

## Creating a changing analog-like signal

The duty cycle does not have to remain constant. It can be changed from one PWM period to the next.

For example:

```text
5%, 8%, 16%, 28%, 42%, 58%, 73%, 84%, 92%, 95% ...
```

If these values follow a sine wave, the **average value of the PWM signal follows a sine wave**.

Normally:

- the **PWM carrier frequency** remains fixed
- the **duty cycle** changes
- the carrier frequency is much higher than the frequency of the signal we want to reproduce

This is conceptually related to sampling: the desired waveform must be represented by sufficiently many PWM cycles. In practice, the PWM frequency is usually **much higher** than the desired signal frequency, not merely above the Nyquist limit.

---

## Something has to average the PWM

PWM by itself is still just a sequence of square pulses. To obtain a smooth physical response, something must effectively **low-pass filter** those pulses.

Different systems provide this naturally.

**LED:** the LED really does flash ON and OFF, but the visual system cannot follow sufficiently rapid changes, so we perceive an average brightness.

**Motor:** the electrical and mechanical system cannot instantaneously respond to every pulse. Motor inductance smooths current, while the rotor's mechanical inertia smooths changes in speed and torque.

**Analog voltage:** an electrical low-pass filter can convert the PWM into a relatively smooth voltage.

!!! tip "Intuition"
    All these systems have something in common: **they cannot respond instantaneously to rapid changes**.

    - **Eye:** photochemical reactions and neural processing take time.
    - **Motor:** inductance slows changes in current, while mechanical inertia slows changes in rotational speed.
    - **RC filter:** the capacitor cannot change its voltage instantaneously, and the resistor controls how quickly it charges and discharges.

    Although the physical mechanisms differ, their effects are similar: **rapid fluctuations are suppressed, while slower changes can still be followed**.

    An electrical low-pass filter deliberately creates this behaviour, much like the natural filtering found in biological and mechanical systems.

The general idea is:

```text
rapid PWM switching
        ↓
low-pass filtering / physical inertia / perception
        ↓
smooth response
```

---

## RC low-pass filter

A simple electrical solution is an **RC (resistor-capacitor) low-pass filter**:

```text
PWM ── R ──┬── output
            │
            C
            │
           GND
```

The capacitor stores charge, so its voltage cannot change instantaneously. It **charges during ON pulses and discharges during OFF periods**.

The resistor limits the charging/discharging current and therefore controls how quickly the capacitor voltage can change.

Together they have the time constant:

$$
\tau = RC
$$

Increasing either $R$ or $C$ makes the response slower and generally increases smoothing.

The cutoff frequency is:

$$
f_c = \frac{1}{2\pi RC}
$$

For PWM reconstruction, the cutoff is chosen so that the **desired slow-changing signal passes**, while the much faster PWM switching is strongly attenuated.

There is a trade-off: stronger filtering reduces PWM ripple but can also make the reconstructed signal respond more slowly and introduce attenuation/phase lag.

---

## Frequency-domain interpretation

A PWM waveform contains many frequency components. Its sharp transitions require substantial **high-frequency content**.

The useful slowly changing information encoded by the duty cycle is at much lower frequencies, while much of the PWM switching energy is around the carrier frequency and its harmonics.

A low-pass filter therefore suppresses the high-frequency switching components while retaining the desired low-frequency behaviour.

!!! note
    The filter is **not performing a Fourier transform**. Fourier analysis is a mathematical way of understanding what the filter does.  
    An RC circuit physically performs the filtering through capacitor charging and discharging.

---

## The eye as a low-pass filter

The visual system also has a limited temporal response.

Photoreceptors and subsequent neural processing do not respond and recover instantaneously. If an LED flashes rapidly enough, the response to one flash has not completely disappeared before the next arrives. The responses therefore overlap, and we perceive relatively continuous illumination.

This means that with PWM LED dimming:

> The **light itself is still pulsing**. A sufficiently fast photodiode or camera can detect the ON/OFF modulation. It is our visual system that makes it appear continuous and interprets different duty cycles as different brightnesses.

Bright-light **afterimages** are related to the broader fact that vision has temporal memory, but they involve stronger and slower retinal/neural adaptation. They are not the mechanism responsible for ordinary PWM flicker fusion.

---

## Key idea

!!! abstract "Summary"
    **PWM does not make a digital signal analog.**

    It encodes an effective level in the **timing of full-amplitude pulses**.  
    A low-pass filter, physical inertia, or a sensory system then averages those rapid changes, producing a smooth response.
