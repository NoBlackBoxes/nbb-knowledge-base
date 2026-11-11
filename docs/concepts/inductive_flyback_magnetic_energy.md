# Inductive flyback: magnetic energy, voltage spikes and protection

## 1. How a coil stores energy

When electric current flows through a wire, it creates a magnetic field. Winding the wire into a coil concentrates this field.

A motor contains coils (windings), so it behaves partly like an **inductor**. As current increases, energy is stored in the magnetic field. When current decreases, that energy can be returned to the electrical circuit.

### Inductance

**Inductance ($L$)** describes how strongly a component resists changes in current. It is measured in **henries (H)**.

- 1 H = 1 henry
- 1 mH = 0.001 H
- 1 µH = 0.000001 H

Inductance depends on the coil's geometry, number of turns and magnetic materials.

### Stored magnetic energy

$$
E = \frac{1}{2}LI^2
$$

Where:
- $E$ = stored energy, in joules (J)
- $L$ = inductance, in henries (H)
- $I$ = current, in amperes (A)

**Example:** A motor winding with an inductance of 1 mH carrying 200 mA:

$$
E = \frac{1}{2}\times0.001\times0.2^2
= 0.00002\text{ J} = 20\,\mu\text{J}
$$

That's just 20 microjoules (millionths of a joule). But even this small amount of energy can generate a surprisingly high voltage.

Notice that energy depends on the **square of the current**. Doubling the current quadruples the stored energy, assuming constant inductance.

---

## 2. What happens when we switch off a motor?

Consider a simple circuit:

- 6 V DC supply
- Small brushed DC motor
- IRL510 N-channel MOSFET controlling the motor on the low side

While the MOSFET is on, current flows from the positive supply through the motor and MOSFET to the negative supply terminal.

The motor's windings store some energy in their magnetic fields.

### The moment the MOSFET switches off

The normal current path is interrupted. But an inductor has an important property:

> **Current through an ideal inductor cannot change instantaneously without an infinite voltage.**

If the motor was carrying 200 mA immediately before switching off, the inductive current initially remains approximately 200 mA.

The magnetic field begins to collapse, releasing stored energy and inducing a voltage that opposes the decrease in current.

This is an example of **Lenz's law**: the induced electrical effect opposes the change that produced it.

The motor effectively tries to keep current flowing in its original direction.

If the normal path is blocked, the voltage at the MOSFET's drain can rise sharply until another electrical path becomes available.

This is called **inductive flyback**.

---

## 3. Why does the voltage become so high?

The fundamental relationship for an ideal inductor is:

$$
V_L = L\frac{dI}{dt}
$$

Where:
- $V_L$ = voltage across the inductor, in volts (V)
- $L$ = inductance, in henries (H)
- $dI/dt$ = rate of change of current, in amperes per second (A/s)

The sign of the voltage depends on the chosen polarity. For understanding the spike, we can work with magnitudes:

$$
|V_L| = L\left|\frac{dI}{dt}\right|
$$

The term $dI/dt$ is a derivative: it describes **how quickly current changes with time**.

### Example: The same current change at different speeds

Suppose we have a 1 mH inductor and its current decreases from 1 A to zero.

If the decrease is approximately uniform:

| Time taken | Induced voltage magnitude |
|---|---|
| 1 second | 0.001 V |
| 1 millisecond | 1 V |
| 1 microsecond | 1,000 V |

The total current change is identical. Only the time differs.

**The faster the current changes, the greater the voltage across the inductance.**

### An important distinction

Switching off the MOSFET does not instantly force the motor current to zero.

Instead, switching changes the available current paths. The inductance and the surrounding circuit jointly determine how the voltage rises and how quickly the current decreases.

The voltage and rate of current change are linked; one does not happen independently before the other.

### An analogy: Water flowing through a pipe

Imagine water flowing through a long pipe. The moving water has inertia.

If you suddenly close a valve, the water cannot stop instantly. A pressure surge develops — a phenomenon called *water hammer*.

The analogy is useful:

- Water flow corresponds to electrical current.
- Pressure difference corresponds to voltage.
- Inertia of the moving water resembles inductance.
- A pressure-relief or bypass path resembles flyback protection.

The analogy isn't exact, but it captures why abruptly interrupting an established flow can create a large pressure or voltage.

---

## 4. Where does the high voltage come from?

A 6 V battery can be part of a circuit that briefly develops tens or hundreds of volts.

This does **not** mean energy has been created from nothing.

The battery previously supplied energy that was stored in the motor's magnetic field. During switching, that energy is transferred or dissipated.

The crucial distinction is:

> **Voltage is energy per unit charge, not the total amount of energy available.**

### What does voltage actually measure?

Voltage between two points is the difference in electric potential energy per unit charge.

$$
V = \frac{E}{Q}
$$

Where:
- $V$ = voltage, in volts (V)
- $E$ = energy transferred, in joules (J)
- $Q$ = electric charge, in coulombs (C)

Therefore:

$$
1\text{ V} = 1\text{ J/C}
$$

**One volt means one joule of energy transferred per coulomb of charge.**

For example, if 1 coulomb of charge passes through a resistor with a voltage drop of 6 V, 6 joules of electrical energy are transferred, mostly into heat.

But voltage doesn't tell us how much total energy is available.

A magnetic field might store only a tiny amount of energy, yet produce a very high voltage as that energy is transferred through a very small amount of charge.

**This is why a 6 V circuit can briefly generate hundreds of volts without creating energy from nothing.**

### From voltage and current to power and energy

We established that voltage measures energy transferred per unit charge:

$$
V = \frac{E}{Q}
$$

Current measures how much charge passes a point per unit time:

$$
I = \frac{Q}{t}
$$

Where:
- $I$ = current, in amperes (A)
- $Q$ = electric charge, in coulombs (C)
- $t$ = time, in seconds (s)

Therefore:

$$
1\text{ A} = 1\text{ C/s}
$$

If voltage tells us **how much energy is transferred per coulomb**, and current tells us **how many coulombs pass per second**, multiplying them gives us the energy transferred per second:

$$
P = VI = \frac{E}{Q}\times\frac{Q}{t}
$$

The charge terms cancel:

$$
\boxed{P = \frac{E}{t}}
$$

This is **electrical power**, measured in watts (W).

$$
1\text{ W} = 1\text{ J/s}
$$

Power tells us how quickly energy is transferred, not how much energy is transferred in total.

For constant voltage and current:

$$
E = Pt = VIt
$$

### Example: A resistor connected to a 6 V battery

Suppose we connect a 6 Ω resistor across a 6 V battery.

Using Ohm's law:

$$
I = \frac{V}{R} = \frac{6}{6} = 1\text{ A}
$$

This means 1 coulomb of charge passes through the resistor every second.

Each coulomb transfers 6 joules of energy, so:

$$
P = VI = 6\times1 = 6\text{ W}
$$

In one second:

$$
E = Pt = 6\times1 = 6\text{ J}
$$

The resistor converts this electrical energy into heat.

Now replace the resistor with a 12 Ω resistor, keeping the voltage at 6 V.

$$
I = \frac{6}{12} = 0.5\text{ A}
$$

Only 0.5 coulombs pass through each second.

Each coulomb still transfers 6 joules, but fewer coulombs pass:

$$
P = 6\times0.5 = 3\text{ W}
$$

In one second, only 3 joules are dissipated.

**At constant voltage, increasing resistance reduces current and therefore reduces power dissipation.**

### Three equivalent power equations

Starting with:

$$
P = VI
$$

And using Ohm's law:

$$
V = IR
$$

We can derive two more expressions.

Substituting $V = IR$:

$$
P = (IR)I = I^2R
$$

Or substituting $I = V/R$:

$$
P = V\frac{V}{R} = \frac{V^2}{R}
$$

Therefore, for a resistor:

$$
\boxed{P = VI = I^2R = \frac{V^2}{R}}
$$

These equations describe the same physical process, but highlight different relationships:

- **Constant voltage:** Increasing resistance reduces power ($P=V^2/R$).
- **Constant current:** Increasing resistance increases power ($P=I^2R$).

### Connecting this back to inductive flyback

This distinction between voltage, current, power and energy is fundamental to understanding flyback.

A motor's magnetic field stores a finite amount of energy:

$$
E_L = \frac{1}{2}LI^2
$$

When the MOSFET switches off, that energy must be transferred or dissipated.

The voltage may become very high, but this doesn't mean a large amount of energy is available.

Power depends on **both voltage and current**, and total transferred energy also depends on **how long that power is sustained**.

For changing voltage and current, the general relationship is:

$$
E = \int P(t)\,dt = \int V(t)I(t)\,dt
$$

The integral simply means adding up the energy transferred during every tiny interval of time.

A very high voltage spike lasting only a short time can therefore involve very little total energy.

However, that doesn't necessarily make it harmless: even a brief high-voltage transient can exceed a semiconductor's electrical limits and cause damage.
### Where can the energy go?

When the MOSFET switches off, the stored magnetic energy may:

1. Be dissipated as heat in the motor windings, diode or resistor.
2. Be transferred into electrical capacitance.
3. Be dissipated during MOSFET avalanche breakdown or electrical arcing.
4. In a spinning motor, interact with ongoing electromechanical energy conversion.

The outcome depends on the circuit.

### Parasitic capacitance

Even without an intentional capacitor, the MOSFET, motor and wiring have small capacitances.

**Capacitance ($C$)** describes how much electric charge is stored per volt and is measured in farads (F).

- 1 µF = $10^{-6}$ F
- 1 nF = $10^{-9}$ F
- 1 pF = $10^{-12}$ F

Energy stored in a capacitor is:

$$
E_C = \frac{1}{2}CV^2
$$

Compare this with magnetic energy:

$$
E_L = \frac{1}{2}LI^2
$$

An inductor stores energy in a **magnetic field**; a capacitor stores energy in an **electric field**.

In an idealised situation where all the inductor's energy transfers to an initially uncharged capacitor:

$$
\frac{1}{2}LI^2 = \frac{1}{2}CV^2
$$

Therefore:

$$
V = I\sqrt{\frac{L}{C}}
$$

For $L=1$ mH, $I=0.2$ A and $C=100$ pF:

$$
V \approx 632\text{ V}
$$

This is an idealised voltage swing, **not a prediction for our actual motor circuit**. Real capacitances are nonlinear, the drain is initially at a nonzero voltage, and other components may conduct or break down first.

It demonstrates why even a small amount of magnetic energy can create a large voltage across a tiny capacitance.

---

## 5. How a flyback diode protects the MOSFET

A **flyback diode** provides a safe path for the inductive current when the MOSFET switches off.

In our low-side switching circuit:

- Motor positive terminal connects to +6 V.
- Motor negative terminal connects to the MOSFET drain.
- MOSFET source connects to ground.
- Flyback diode connects across the motor.
- Diode **cathode (striped end)** connects to +6 V.
- Diode **anode** connects to the MOSFET drain.

### MOSFET on

The motor runs normally.

The diode is reverse-biased and carries essentially no current.

### MOSFET off

The motor's inductance tries to maintain the current in the same direction through its windings.

The drain voltage rises slightly above the +6 V rail, forward-biasing the diode.

The current now circulates:

**Motor → flyback diode → motor**

The diode returns current to the positive supply node, which is also connected to the battery's positive terminal. However, the current then flows back through the motor windings, completing a local loop rather than passing through the battery.

The current gradually decreases as the stored energy is dissipated.

### Why does the diode limit the voltage?

A conventional silicon diode typically has a forward voltage drop of approximately 0.6–0.8 V when conducting.

Using 0.7 V as an approximation:

$$
V_{\text{drain}} \approx 6 + 0.7 = 6.7\text{ V}
$$

Instead of rising to potentially destructive voltages, the drain stays close to the supply voltage.

The exact value depends on the diode and current.

**The diode doesn't prevent induction. It gives the current a path that limits the voltage required to sustain it.**

### Why not connect the diode to ground?

Current needs a **closed loop**.

Ground is a voltage reference, not a place where unwanted current disappears.

The diode must provide the appropriate return path for the motor's inductive current.

---

## 6. What happens if we add a resistor?

Suppose we put a resistor in series with the flyback diode.

The initial inductive current is approximately the same as the current immediately before switching off.

A resistor requires a voltage across it to carry current:

$$
V_R=IR
$$

For an initial current of 200 mA:

| Series resistance | Initial resistor voltage |
|---|---|
| 10 Ω | 2 V |
| 100 Ω | 20 V |
| 1,000 Ω | 200 V |

These are idealised initial values, assuming the intended discharge path conducts and no other component limits the voltage first.

With a 100 Ω resistor and a silicon diode:

$$
V_{\text{drain}}\approx6+20+0.7=26.7\text{ V}
$$

Adding resistance allows a higher flyback voltage.

### Why does a higher resistance make current decay faster?

A larger voltage across the inductance produces a larger rate of current change:

$$
|V_L|=L\left|\frac{dI}{dt}\right|
$$

In a simple ideal RL discharge:

$$
I(t)=I_0e^{-Rt/L}
$$

Where:
- $I(t)$ = current after time $t$
- $I_0$ = initial current
- $R$ = discharge-loop resistance
- $L$ = inductance
- $e$ = mathematical constant, approximately 2.718

The characteristic decay time is:

$$
\tau=\frac{L}{R}
$$

This is called the **time constant**.

After one time constant, the current has fallen to approximately 37% of its initial value.

- Higher resistance → shorter time constant → faster current decay.
- Lower resistance → longer time constant → slower current decay.

This simple exponential model assumes a fixed resistance and inductance without a constant diode voltage drop. Real flyback circuits differ somewhat.

### An important consequence

The resistor does not substantially reduce the **initial current** through the flyback path.

It increases the voltage and makes the current decay faster.

This is why adding a resistor isn't automatically a safe way to protect an LED from excessive peak current.

---

## 7. Can we use an LED as a flyback indicator?

An LED is a light-emitting diode. Like an ordinary diode, it conducts primarily in one direction, but it also emits light when sufficient forward current flows.

In principle, an LED could briefly illuminate as the motor's stored magnetic energy is released.

However, there are complications.

### The initial current may be too high

Suppose the motor draws 200 mA before switching off.

The flyback path initially carries approximately 200 mA.

That may exceed the LED's permissible forward current, even if the pulse is brief.

The relevant limits depend on the LED's continuous-current rating, pulsed-current rating and pulse duration.

### Adding a resistor creates a trade-off

A series resistor makes the current decay faster, but doesn't eliminate the initial current peak. It also increases the voltage the MOSFET must withstand.

### Keeping the ordinary diode in series with the LED

If both diodes are oriented to conduct the flyback current, the initial drain voltage is approximately:

$$
V_{\text{drain}}\approx V_{\text{supply}}+V_D+V_{LED}+I_0R
$$

Where:
- $V_D$ = ordinary diode forward voltage
- $V_{LED}$ = LED forward voltage
- $R$ = any additional series resistance

For a 6 V supply, 0.7 V diode, 2 V LED and no additional resistor:

$$
V_{\text{drain}}\approx8.7\text{ V}
$$

This is only an approximate clamp voltage while the diodes conduct. The LED still has to withstand the initial motor current.

**A diode in series with an LED does not limit the current.**

Also, if the LED fails open-circuit, the intended flyback path disappears and the MOSFET may become vulnerable to voltage spikes.

For a robust classroom demonstration, a properly designed separate indicator or clamped flyback circuit is preferable.

### What about the IRL510?

The IRL510 MOSFET has a rated maximum drain-source voltage of 100 V.

That rating is not a target operating voltage, and staying below it alone does not guarantee a safe design.

The motor current, switching behaviour, diode characteristics, wiring and energy dissipation all matter.

---

## 8. Why a real motor is more complicated

A motor isn't simply a coil.

It also has:
- Winding resistance.
- Back electromotive force (back-EMF) caused by rotation.
- Mechanical energy stored in its spinning rotor.
- Commutation effects as the brushes switch between windings.

A simplified motor equation is:

$$
V=RI+L\frac{dI}{dt}+E_{\text{back}}
$$

Where:
- $RI$ = voltage across the winding resistance.
- $L\,dI/dt$ = voltage associated with changing current.
- $E_{\text{back}}$ = voltage generated by rotation.

The signs depend on the chosen reference directions.

This means a spinning motor's behaviour after switching off is more complicated than a simple inductor discharging through a resistor.

Nevertheless, the flyback principle remains the same.

---

## 9. Putting it all together

Imagine the motor is running from a 6 V supply.

1. **Current flows.** The motor's windings create a magnetic field and store energy.
2. **The MOSFET switches off.** The normal current path disappears.
3. **The inductance resists the current change.** The current cannot stop instantaneously.
4. **The drain voltage rises.** The changing magnetic field produces the voltage required by the evolving circuit conditions.
5. **Another path carries the current.** Ideally, this is the flyback diode. Otherwise, capacitances, avalanche breakdown or other mechanisms may become involved.
6. **The current decays.** The stored magnetic energy is transferred or dissipated.
7. **The voltage returns towards its normal level.** Once the inductive transient has ended, the flyback diode stops conducting.

### The essential relationships

| Quantity | Equation | Meaning |
|---|---|---|
| Induced voltage | $V_L=L\,dI/dt$ | Faster current change means greater voltage magnitude |
| Magnetic energy | $E=\frac12 LI^2$ | Energy stored in the magnetic field |
| Resistor voltage | $V_R=IR$ | Current through resistance requires voltage |
| RL time constant | $\tau=L/R$ | Higher resistance means faster current decay |
| Capacitor energy | $E_C=\frac12 CV^2$ | Energy stored in an electric field |

### Final intuition

Think of inductance as electrical inertia.

A moving object resists a sudden change in velocity. Similarly, current through an inductor resists a sudden change.

When the MOSFET switches off, the current doesn't simply disappear. The stored magnetic energy continues to drive it.

If a low-voltage path exists, the current decays relatively slowly.

If the path requires a higher voltage, the voltage can rise dramatically and the current may decay much faster.

If no suitable path exists, the voltage may rise until capacitance, breakdown or another physical mechanism accommodates the current.

**The energy was already stored in the magnetic field. The circuit determines how that energy is released, how quickly the current changes, and how high the voltage rises.**