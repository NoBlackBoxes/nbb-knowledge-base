---
title: Buck and Boost Converters
tags:
- technical
- electronics
- hardware
- power
author: viktor
---

# Buck and Boost Converters

## The key electromagnetic ideas

A current flowing through a conductor creates a **magnetic field**. In a coil, the fields produced by each turn reinforce one another, so an inductor can store significant energy in its magnetic field.

$$
E_L = \frac{1}{2} L I^2
$$

The inverse relationship needs an important distinction:

!!! info "Important"
    A **changing magnetic field induces a voltage**, not directly a current.

If the circuit is closed, this induced voltage can then drive a current. If the circuit is open, there can be an induced voltage but no current.

Therefore:

**Current → magnetic field**

**Changing magnetic field → induced voltage → current, if a closed path exists**

This is the basis of inductors, generators, and transformers.

---

## Why an inductor opposes changes in current

An inductor does not oppose current itself. It opposes **changes in current**.

When current flows through an inductor, it creates a magnetic field. If the current changes, the magnetic field also changes. This changing magnetic field induces a voltage across the inductor.

The induced voltage always acts in a direction that **opposes the change in current**:

- If current is **increasing**, the magnetic field grows and the induced voltage acts against the voltage causing the increase. This slows down the increase in current.
- If current is **decreasing**, the magnetic field collapses and the induced voltage changes polarity, pushing current in its original direction. This slows down the decrease in current.

This relationship is described by:

$$
V_L = L \frac{dI}{dt}
$$

where:

- $V_L$ = voltage across the inductor, in volts (V)
- $L$ = inductance, in henries (H)
- $I$ = current through the inductor, in amperes (A)
- $t$ = time, in seconds (s)
- $\frac{dI}{dt}$ = how quickly the current is changing

Therefore:

- **Faster change in current → larger induced voltage**
- **Larger inductance → larger voltage for the same rate of current change**

A useful way to remember this is:

> **An inductor generates a voltage with a polarity that tries to keep its current from changing.**

This explains both sides of its behaviour:

    Switch ON:
    applied voltage → current starts increasing
                    → magnetic field grows
                    → induced voltage opposes the increase
                    → current rises gradually

    Switch OFF:
    current starts decreasing
            → magnetic field collapses
            → induced voltage reverses polarity
            → pushes current in its original direction
            → current falls gradually

The energy involved is the energy stored in the magnetic field:

$$
E_L = \frac{1}{2} L I^2
$$

When the field collapses, this stored energy is returned to the circuit.

!!! tip "Intuition"
    **An inductor acts like a buffer for current:** it absorbs energy when current tries to increase and releases that energy when current tries to decrease, smoothing rapid changes in current. **Like inflating a balloon:** while you blow into it, some energy goes into stretching it; when you stop blowing, the balloon releases that stored energy and keeps air flowing for a while.

---

## The capacitor as a voltage buffer

Just as an **inductor acts as a buffer for current**, a **capacitor acts as a buffer for voltage**.

A capacitor stores energy in an **electric field**. It charges when the circuit supplies more current than the load needs and discharges when the load needs more current than is currently being supplied.

This prevents the output voltage from changing rapidly:

- **Voltage tries to rise** → capacitor charges and absorbs energy
- **Voltage tries to fall** → capacitor discharges and supplies energy

Therefore:

> **Inductor → smooths current**
>
> **Capacitor → smooths voltage**

In a switching converter, the inductor keeps the current relatively smooth between switching cycles, while the capacitor keeps the output voltage relatively smooth.

Together, they turn the rapidly switched waveform into a nearly steady DC output.

---

## Buck converter

A buck converter converts a higher DC voltage into a lower DC voltage using rapid switching, an inductor, and a capacitor.

### Switch ON

The input is connected through the switch to the inductor and load.

    Vin → switch → inductor → load

Current through the inductor increases and its magnetic field stores energy.

### Switch OFF

The input is disconnected, but the inductor current cannot suddenly stop.

Its magnetic field begins collapsing, inducing a voltage that keeps current flowing through the load using the diode (or a second MOSFET) as a return path.

    inductor → load → diode → inductor

The inductor is now releasing its stored magnetic energy into the circuit.

The switch repeatedly alternates between these states, often hundreds of thousands of times per second.

### Why is the output voltage lower?

The switching effectively produces **PWM**.

For an ideal buck converter operating normally:

$$
V_{out} \approx D V_{in}
$$

where $D$ is the duty cycle.

For example, with $V_{in} = 12\,\mathrm{V}$ and a 25% duty cycle:

$$
V_{out} \approx 0.25 \times 12 = 3\,\mathrm{V}
$$

So the buck converter can be thought of as:

> **PWM + energy-storing inductor + smoothing capacitor**

The **duty cycle primarily determines the output voltage**.

The inductor value does *not* directly set the output voltage. Instead, it determines how quickly current can change and therefore strongly affects current ripple, operating mode, and transient behaviour.

From

$$
V_L = L \frac{dI}{dt}
$$

we get

$$
\frac{dI}{dt} = \frac{V_L}{L}
$$

so:

- Larger $L$ → current changes more slowly → less current ripple
- Smaller $L$ → current changes faster → more current ripple

The capacitor mainly smooths the remaining **voltage ripple**, supplying or absorbing current when the instantaneous inductor current does not exactly match the load current.

#### Where does the excess voltage go?

It is not simply burned away.

Ideally, power is approximately conserved:

$$
P_{in} \approx P_{out}
$$

Therefore:

$$
V_{in} I_{in} \approx V_{out} I_{out}
$$

Reducing voltage therefore allows greater output current. This is why switching converters can be much more efficient than linear regulators.

---

## Boost converter

A boost converter uses the same magnetic-energy-storage principle to produce a voltage **higher** than its input.

### Switch ON

The switch creates a path through the inductor:

    Vin → inductor → switch → ground

Current increases and energy accumulates in the inductor's magnetic field.

During this part of the cycle, the output capacitor helps supply the load.

### Switch OFF

The switch opens.

The inductor tries to maintain its current, so its collapsing magnetic field induces a voltage.

The circuit is arranged so that this induced voltage is effectively **added to the input voltage**:

    Vin + induced inductor voltage → diode → output

The combined voltage charges the output capacitor to a voltage higher than $V_{in}$ and supplies the load.

Thus:

> **Buck:** the inductor keeps supplying current while the input is periodically disconnected.
>
> **Boost:** the stored energy is released so that the inductor's induced voltage adds to the input voltage.

---

## Boost converter vs transformer

Both can increase voltage, and both rely on changing magnetic fields, but they operate differently.

### Transformer

A transformer has magnetically coupled windings:

    primary current
          ↓
    changing magnetic flux
          ↓
    induced secondary voltage

Its voltage ratio is primarily determined by the turns ratio:

$$
\frac{V_2}{V_1} = \frac{N_2}{N_1}
$$

A transformer requires a **changing current/flux**. Steady DC produces a steady magnetic field and therefore does not continuously induce a secondary voltage.

An ideal transformer mainly **transfers energy magnetically from one winding to another** rather than deliberately storing energy between switching phases.

### Boost converter

A boost converter normally uses one inductor and deliberately:

1. Stores energy in its magnetic field.
2. Changes the circuit using a switch.
3. Releases that energy at a higher voltage.

Its conversion ratio is controlled primarily by **switching duty cycle**, rather than a winding turns ratio.

Both approximately trade voltage against current while conserving power.

---

## Mental model

    CURRENT
       ↓
    creates
       ↓
    MAGNETIC FIELD
       ↓
    if changing, induces
       ↓
    VOLTAGE
       ↓
    drives current if a closed path exists

This resolves an important common confusion:

!!! info "Important"
    Moving a magnet through a coil does not fundamentally "generate current." The changing magnetic flux induces a **voltage**. Current flows only when there is a closed circuit.

From this, switching converters become fairly intuitive:

### Buck

    PWM switching
        ↓
    repeatedly store/release magnetic energy
        ↓
    LC smoothing
        ↓
    lower DC voltage

### Boost

    store magnetic energy
        ↓
    switch circuit
        ↓
    induced inductor voltage adds to Vin
        ↓
    higher DC voltage

### Transformer

    changing current in primary
        ↓
    changing magnetic flux
        ↓
    induced voltage in secondary
        ↓
    voltage set by turns ratio